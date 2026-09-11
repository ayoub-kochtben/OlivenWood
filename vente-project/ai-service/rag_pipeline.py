"""
================================================================================
RAG PIPELINE UNIFIÉ — Ingestion + Retrieval + Generation
================================================================================

Fusionne dans un seul système :
  - Ingestion  : fichiers .txt (RecursiveCharacterTextSplitter)
                 et fichiers .pdf multimodaux (texte + tableaux + images,
                 via `unstructured`, avec résumés IA pour le contenu enrichi)
  - Retrieval  : Hybrid Search (BM25 + recherche vectorielle Chroma),
                 Multi-Query (génération de variantes de la question),
                 Reciprocal Rank Fusion (RRF) pour fusionner les résultats,
                 Reranking (CrossEncoder) pour affiner le classement final
  - Generation : réponse "history-aware" (reformulation de la question à
                 partir de l'historique) + prompt multimodal (texte/tableaux/
                 images) envoyé à un modèle Ollama (texte ou vision)

Installation (environnement virtuel recommandé) :
    pip install langchain langchain-community langchain-chroma \
                langchain-huggingface langchain-ollama langchain-text-splitters \
                langchain-classic sentence-transformers rank-bm25 \
                "unstructured[pdf]" pydantic python-dotenv chromadb

Prérequis :
    - Ollama installé et démarré (`ollama serve`)
    - Modèles téléchargés : `ollama pull llama3` et, pour le PDF multimodal,
      `ollama pull llava`

Utilisation :
    python rag_pipeline.py ingest docs/            # ingère un dossier de .txt
    python rag_pipeline.py ingest docs/rapport.pdf  # ingère un PDF multimodal
    python rag_pipeline.py chat                     # lance le chat interactif
================================================================================
"""
import pickle

import os
import sys
import json
from collections import defaultdict
from typing import List, Optional, Tuple

from dotenv import load_dotenv
from pydantic import BaseModel

from langchain_core.documents import Document
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import TextLoader, DirectoryLoader
from langchain_community.retrievers import BM25Retriever
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma

# LLM texte : Groq en priorité (cloud, rapide, pas d'infra à gérer),
# fallback sur Ollama en local si pas de clé Groq (utile en dev sans réseau).
from langchain_groq import ChatGroq
try:
    from langchain_ollama import ChatOllama
except ImportError:
    ChatOllama = None


try:
    # Nom récent du package qui héberge EnsembleRetriever
    from langchain_classic.retrievers import EnsembleRetriever
except ImportError:
    from langchain.retrievers import EnsembleRetriever

from sentence_transformers import CrossEncoder

load_dotenv()


# ================================================================
# 1. CONFIGURATION
# ================================================================

class RAGConfig:
    """Centralise tous les paramètres réglables du pipeline."""

    # Ingestion
    persist_directory = "db/chroma_db"
    embedding_model_name = "all-MiniLM-L6-v2"
    chunk_size = 800
    chunk_overlap = 0
    pdf_max_characters = 3000
    pdf_new_after_n_chars = 2400
    pdf_combine_under_n_chars = 500

    # LLM texte (Groq en prod, Ollama en fallback local)
    groq_model = "llama-3.3-70b-versatile"
    llm_model = "llama3"          # utilisé seulement si Ollama (fallback local)
    vision_model = "llava"        # modèle vision : uniquement disponible via Ollama
    temperature = 0

    # Retrieval
    vector_k = 10
    bm25_k = 10
    hybrid_weights = (0.7, 0.3)          # (vecteur, BM25)
    num_query_variations = 3
    rrf_k = 60
    rerank_top_n = 5
    reranker_model_name = "cross-encoder/ms-marco-MiniLM-L-6-v2"


class QueryVariations(BaseModel):
    """Schéma de sortie structurée pour la génération multi-query."""
    queries: List[str]


def save_documents_cache(documents: List[Document], path: str = "db/documents_cache.pkl"):
    """Sauvegarde les documents ingérés pour pouvoir reconstruire BM25 plus tard."""
    with open(path, "wb") as f:
        pickle.dump(documents, f)


def load_documents_cache(path: str = "db/documents_cache.pkl") -> Optional[List[Document]]:
    """Recharge les documents sauvegardés (utilisé au redémarrage du service)."""
    if not os.path.exists(path):
        return None
    with open(path, "rb") as f:
        return pickle.load(f)


# ================================================================
# 1bis. FABRIQUE DE LLM (Groq en prod, Ollama en fallback local)
# ================================================================

def get_text_llm(config: RAGConfig = RAGConfig, temperature: Optional[float] = None):
    """Retourne le LLM texte à utiliser : Groq si GROQ_API_KEY est définie
    (typiquement sur Railway), sinon Ollama en local (si installé)."""
    temp = config.temperature if temperature is None else temperature
    groq_api_key = os.environ.get("GROQ_API_KEY")

    if groq_api_key:
        return ChatGroq(model=config.groq_model, api_key=groq_api_key, temperature=temp)

    if ChatOllama is not None:
        return ChatOllama(model=config.llm_model, temperature=temp)

    raise RuntimeError(
        "Aucun LLM disponible : définis GROQ_API_KEY (recommandé en prod) "
        "ou installe/lance Ollama en local."
    )


def get_vision_llm(config: RAGConfig = RAGConfig, temperature: Optional[float] = None):
    """Retourne le LLM vision (utilisé uniquement pour les PDF contenant des
    images). Nécessite Ollama en local avec le modèle `llava` — pas
    disponible sur Railway sans Ollama déployé séparément."""
    temp = config.temperature if temperature is None else temperature
    if ChatOllama is None:
        raise RuntimeError(
            "Le traitement d'images nécessite Ollama (modèle llava), "
            "non disponible dans cet environnement."
        )
    return ChatOllama(model=config.vision_model, temperature=temp)


# ================================================================
# 2. INGESTION — TEXTE (.txt)
# ================================================================

def load_text_documents(docs_path: str) -> List[Document]:
    """Charge tous les .txt d'un dossier."""
    if not os.path.exists(docs_path):
        raise FileNotFoundError(f"Le dossier {docs_path} n'existe pas.")

    loader = DirectoryLoader(
        path=docs_path,
        glob="*.txt",
        loader_cls=TextLoader,
        loader_kwargs={"encoding": "utf-8"},
    )
    documents = loader.load()

    if not documents:
        raise FileNotFoundError(f"Aucun fichier .txt trouvé dans {docs_path}.")

    return documents


def split_text_documents(
    documents: List[Document],
    chunk_size: int = RAGConfig.chunk_size,
    chunk_overlap: int = RAGConfig.chunk_overlap,
) -> List[Document]:
    """Découpe des documents texte avec le RecursiveCharacterTextSplitter."""
    splitter = RecursiveCharacterTextSplitter(
        separators=["\n\n", "\n", ". ", " ", ""],
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
    )
    chunks = splitter.split_documents(documents)
    print(f"[Ingestion TXT] {len(chunks)} chunks créés depuis {len(documents)} document(s).")
    return chunks


# ================================================================
# 3. INGESTION — PDF MULTIMODAL (texte + tableaux + images)
# ================================================================

def partition_pdf_document(file_path: str):
    """Extrait les éléments (texte, tableaux, images) d'un PDF via `unstructured`."""
    from unstructured.partition.pdf import partition_pdf

    print(f"[Ingestion PDF] Partitionnement de {file_path}...")
    elements = partition_pdf(
        filename=file_path,
        strategy="hi_res",
        infer_table_structure=True,
        extract_image_block_types=["Image"],
        extract_image_block_to_payload=True,
    )
    print(f"[Ingestion PDF] {len(elements)} éléments extraits.")
    return elements


def chunk_pdf_elements(elements, config: RAGConfig = RAGConfig):
    """Regroupe les éléments PDF en chunks logiques (par titres de section)."""
    from unstructured.chunking.title import chunk_by_title

    chunks = chunk_by_title(
        elements,
        max_characters=config.pdf_max_characters,
        new_after_n_chars=config.pdf_new_after_n_chars,
        combine_text_under_n_chars=config.pdf_combine_under_n_chars,
    )
    print(f"[Ingestion PDF] {len(chunks)} chunks créés.")
    return chunks


def separate_content_types(chunk) -> dict:
    """Sépare texte / tableaux / images à l'intérieur d'un chunk `unstructured`."""
    content_data = {"text": chunk.text, "tables": [], "images": [], "types": ["text"]}

    if hasattr(chunk, "metadata") and hasattr(chunk.metadata, "orig_elements"):
        for element in chunk.metadata.orig_elements:
            element_type = type(element).__name__

            if element_type == "Table":
                content_data["types"].append("table")
                table_html = getattr(element.metadata, "text_as_html", element.text)
                content_data["tables"].append(table_html)

            elif element_type == "Image":
                if hasattr(element, "metadata") and hasattr(element.metadata, "image_base64"):
                    content_data["types"].append("image")
                    content_data["images"].append(element.metadata.image_base64)

    content_data["types"] = list(set(content_data["types"]))
    return content_data


def create_ai_enhanced_summary(
    text: str,
    tables: List[str],
    images: List[str],
    config: RAGConfig = RAGConfig,
) -> str:
    """Crée une description enrichie et recherchable pour un chunk mixte
    (texte + tableaux + images), via un LLM (vision si images, texte sinon)."""
    try:
        llm = get_vision_llm(config) if images else get_text_llm(config)

        prompt_text = f"""You are creating a searchable description for document content retrieval.

CONTENT TO ANALYZE:
TEXT CONTENT:
{text}

"""
        if tables:
            prompt_text += "TABLES:\n"
            for i, table in enumerate(tables):
                prompt_text += f"Table {i + 1}:\n{table}\n\n"

        prompt_text += """
YOUR TASK:
Generate a comprehensive, searchable description that covers:
1. Key facts, numbers, and data points from text and tables
2. Main topics and concepts discussed
3. Questions this content could answer
4. Visual content analysis (charts, diagrams, patterns in images)
5. Alternative search terms users might use

Make it detailed and searchable - prioritize findability over brevity.

SEARCHABLE DESCRIPTION:"""

        if images:
            message_content = [{"type": "text", "text": prompt_text}]
            for image_base64 in images:
                message_content.append(
                    {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{image_base64}"}}
                )
            message = HumanMessage(content=message_content)
        else:
            message = HumanMessage(content=prompt_text)

        response = llm.invoke([message])
        return response.content

    except Exception as e:
        print(f"     ❌ Résumé IA impossible : {e}")
        summary = f"{text[:300]}..."
        if tables:
            summary += f" [Contient {len(tables)} tableau(x)]"
        if images:
            summary += f" [Contient {len(images)} image(s)]"
        return summary


def build_documents_from_pdf_chunks(chunks, config: RAGConfig = RAGConfig) -> List[Document]:
    """Transforme les chunks `unstructured` en `Document` LangChain, avec un
    résumé IA en `page_content` (utilisé pour l'embedding/la recherche) et le
    contenu brut (texte/tableaux/images) conservé en métadonnée pour la
    génération finale."""
    print("🧠 Traitement des chunks PDF avec résumés IA...")
    langchain_documents = []

    for i, chunk in enumerate(chunks, 1):
        print(f"   Chunk {i}/{len(chunks)}")
        content_data = separate_content_types(chunk)
        print(f"     Types : {content_data['types']} | "
              f"Tableaux : {len(content_data['tables'])} | Images : {len(content_data['images'])}")

        if content_data["tables"] or content_data["images"]:
            enhanced_content = create_ai_enhanced_summary(
                content_data["text"], content_data["tables"], content_data["images"], config
            )
        else:
            enhanced_content = content_data["text"]

        doc = Document(
            page_content=enhanced_content,
            metadata={
                "source": f"pdf_chunk_{i}",
                "original_content": json.dumps(
                    {
                        "raw_text": content_data["text"],
                        "tables_html": content_data["tables"],
                        "images_base64": content_data["images"],
                    }
                ),
            },
        )
        langchain_documents.append(doc)

    print(f"✅ {len(langchain_documents)} chunks PDF traités.")
    return langchain_documents


def ingest_pdf(file_path: str, config: RAGConfig = RAGConfig) -> List[Document]:
    """Pipeline complet d'ingestion d'un PDF multimodal -> liste de Document."""
    elements = partition_pdf_document(file_path)
    chunks = chunk_pdf_elements(elements, config)
    return build_documents_from_pdf_chunks(chunks, config)


# ================================================================
# 4. VECTOR STORE + BM25 + HYBRID RETRIEVER
# ================================================================

def get_embedding_model(config: RAGConfig = RAGConfig) -> HuggingFaceEmbeddings:
    return HuggingFaceEmbeddings(model_name=config.embedding_model_name)


def build_vector_store(
    documents: List[Document],
    config: RAGConfig = RAGConfig,
    persist_directory: Optional[str] = None,
) -> Chroma:
    """Crée (ou met à jour) la base vectorielle Chroma."""
    embedding_model = get_embedding_model(config)
    vectorstore = Chroma.from_documents(
        documents=documents,
        embedding=embedding_model,
        persist_directory=persist_directory or config.persist_directory,
        collection_metadata={"hnsw:space": "cosine"},
    )
    print(f"[Vector store] {len(documents)} documents indexés dans "
          f"{persist_directory or config.persist_directory}.")
    return vectorstore


def load_vector_store(config: RAGConfig = RAGConfig, persist_directory: Optional[str] = None) -> Chroma:
    """Recharge une base vectorielle Chroma déjà persistée."""
    embedding_model = get_embedding_model(config)
    return Chroma(
        persist_directory=persist_directory or config.persist_directory,
        embedding_function=embedding_model,
        collection_metadata={"hnsw:space": "cosine"},
    )


def build_bm25_retriever(documents: List[Document], config: RAGConfig = RAGConfig) -> BM25Retriever:
    """Index de recherche par mots-clés (complémentaire au vectoriel)."""
    bm25 = BM25Retriever.from_documents(documents)
    bm25.k = config.bm25_k
    return bm25


def build_hybrid_retriever(
    vectorstore: Chroma,
    bm25_retriever: BM25Retriever,
    config: RAGConfig = RAGConfig,
) -> EnsembleRetriever:
    """Combine recherche sémantique (vecteur) et recherche par mots-clés (BM25)."""
    vector_retriever = vectorstore.as_retriever(search_kwargs={"k": config.vector_k})
    return EnsembleRetriever(
        retrievers=[vector_retriever, bm25_retriever],
        weights=list(config.hybrid_weights),
    )


# ================================================================
# 5. MULTI-QUERY + RECIPROCAL RANK FUSION (RRF)
# ================================================================

def generate_query_variations(
    llm, query: str, n: int = RAGConfig.num_query_variations
) -> List[str]:
    """Demande au LLM de reformuler la question sous plusieurs angles."""
    llm_structured = llm.with_structured_output(QueryVariations)
    prompt = f"""Generate {n} different variations of this query that would help retrieve relevant documents:

Original query: {query}

Return {n} alternative queries that rephrase or approach the same question from different angles."""

    try:
        response = llm_structured.invoke(prompt)
        variations = response.queries
    except Exception as e:
        print(f"     ⚠️ Génération multi-query impossible ({e}), on garde la question originale.")
        variations = []

    # La question originale est toujours incluse
    return [query] + [v for v in variations if v.strip() and v.strip() != query]


def reciprocal_rank_fusion(
    chunk_lists: List[List[Document]], k: int = RAGConfig.rrf_k, verbose: bool = False
) -> List[Tuple[Document, float]]:
    """Fusionne plusieurs listes de résultats (une par variante de requête)
    en un seul classement pondéré par la position dans chaque liste."""
    rrf_scores = defaultdict(float)
    unique_docs = {}

    for query_idx, docs in enumerate(chunk_lists, 1):
        for position, doc in enumerate(docs, 1):
            key = doc.page_content
            unique_docs[key] = doc
            score = 1 / (k + position)
            rrf_scores[key] += score
            if verbose:
                print(f"  Requête {query_idx}, position {position}: +{score:.4f} -> total {rrf_scores[key]:.4f}")

    sorted_docs = sorted(
        [(unique_docs[key], score) for key, score in rrf_scores.items()],
        key=lambda x: x[1],
        reverse=True,
    )
    return sorted_docs


# ================================================================
# 6. RERANKING (CrossEncoder)
# ================================================================

_reranker_cache = {}


def get_reranker(config: RAGConfig = RAGConfig) -> CrossEncoder:
    if config.reranker_model_name not in _reranker_cache:
        _reranker_cache[config.reranker_model_name] = CrossEncoder(config.reranker_model_name)
    return _reranker_cache[config.reranker_model_name]


def rerank_documents(
    query: str,
    documents: List[Document],
    config: RAGConfig = RAGConfig,
    top_n: Optional[int] = None,
) -> List[Document]:
    """Réordonne les documents par pertinence réelle vis-à-vis de la requête."""
    if not documents:
        return []

    reranker = get_reranker(config)
    pairs = [[query, doc.page_content] for doc in documents]
    scores = reranker.predict(pairs)

    reranked = [doc for doc, _ in sorted(zip(documents, scores), key=lambda x: x[1], reverse=True)]
    return reranked[: top_n or config.rerank_top_n]


# ================================================================
# 7. HISTORY-AWARE QUESTION REWRITING
# ================================================================

def contextualize_question(
    llm, chat_history: List, question: str
) -> str:
    """Réécrit la question courante en une question autonome, en tenant
    compte de l'historique de conversation (utile pour le multi-tour)."""
    if not chat_history:
        return question

    messages = (
        [SystemMessage(content=(
            "Given the chat history, rewrite the new question to be standalone "
            "and searchable. Just return the rewritten question."
        ))]
        + chat_history
        + [HumanMessage(content=f"New question: {question}")]
    )
    result = llm.invoke(messages)
    return result.content.strip()


# ================================================================
# 8. GÉNÉRATION DE LA RÉPONSE (texte + tableaux + images)
# ================================================================

def build_generation_prompt(query: str, documents: List[Document]) -> Tuple[str, List[str]]:
    """Construit le prompt final. Si des documents contiennent du contenu
    multimodal (metadata `original_content`), on l'exploite ; sinon on
    utilise simplement `page_content`."""
    prompt = f"Based on the following documents, please answer this question: {query}\n\nDocuments:\n"
    all_images: List[str] = []

    for i, doc in enumerate(documents, 1):
        prompt += f"\n--- Document {i} ---\n"

        if "original_content" in doc.metadata:
            original = json.loads(doc.metadata["original_content"])
            raw_text = original.get("raw_text", "")
            if raw_text:
                prompt += f"TEXT:\n{raw_text}\n"

            tables_html = original.get("tables_html", [])
            if tables_html:
                prompt += "TABLES:\n"
                for j, table in enumerate(tables_html, 1):
                    prompt += f"Table {j}:\n{table}\n"

            all_images.extend(original.get("images_base64", []))
        else:
            prompt += f"- {doc.page_content}\n"

    prompt += (
        '\nPlease provide a clear, comprehensive answer using only the information above. '
        'If the answer isn\'t in the documents, say: '
        '"I don\'t have enough information to answer that question based on the provided documents."\n'
    )
    return prompt, all_images


def generate_answer(query: str, documents: List[Document], config: RAGConfig = RAGConfig) -> str:
    """Envoie le contexte (texte/tableaux/images) au LLM et récupère la réponse."""
    prompt_text, images = build_generation_prompt(query, documents)
    llm = get_vision_llm(config) if images else get_text_llm(config)

    if images:
        message_content = [{"type": "text", "text": prompt_text}]
        for image_base64 in images:
            message_content.append(
                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{image_base64}"}}
            )
        messages = [HumanMessage(content=message_content)]
    else:
        messages = [
            SystemMessage(content="You are a helpful assistant."),
            HumanMessage(content=prompt_text),
        ]

    response = llm.invoke(messages)
    return response.content


# ================================================================
# 9. PIPELINE PRINCIPAL
# ================================================================

class RAGPipeline:
    """Orchestrateur haut niveau : ingestion + retrieval avancé + génération."""

    def __init__(self, config: RAGConfig = RAGConfig):
        self.config = config
        self.llm = get_text_llm(config)
        self.vectorstore: Optional[Chroma] = None
        self.bm25_retriever: Optional[BM25Retriever] = None
        self.hybrid_retriever: Optional[EnsembleRetriever] = None
        self.all_documents: List[Document] = []
        self.chat_history: List = []

    # ---------------------- INGESTION ----------------------

    def load_existing(self, persist_directory: Optional[str] = None, documents_for_bm25: Optional[List[Document]] = None):
        """Recharge une base Chroma déjà persistée (BM25 nécessite les
        documents en mémoire — à repasser si tu veux le hybrid search complet)."""
        self.vectorstore = load_vector_store(self.config, persist_directory)
        if documents_for_bm25:
            self.all_documents = documents_for_bm25
            self.bm25_retriever = build_bm25_retriever(documents_for_bm25, self.config)
            self.hybrid_retriever = build_hybrid_retriever(self.vectorstore, self.bm25_retriever, self.config)
        else:
            print("⚠️ BM25/hybrid non initialisé (pas de documents fournis) — "
                  "utilisation de la recherche vectorielle seule.")

    # ---------------------- RETRIEVAL AVANCÉ ----------------------
    def ingest(self, path: str, persist_directory: Optional[str] = None):
        """Ingère un dossier de .txt OU un fichier .pdf multimodal."""
        if os.path.isdir(path):
            raw_docs = load_text_documents(path)
            documents = split_text_documents(raw_docs, self.config.chunk_size, self.config.chunk_overlap)
        elif path.lower().endswith(".pdf"):
            documents = ingest_pdf(path, self.config)
        else:
            raise ValueError("Le chemin doit être un dossier de .txt ou un fichier .pdf")

        self.all_documents = documents
        self.vectorstore = build_vector_store(documents, self.config, persist_directory)
        self.bm25_retriever = build_bm25_retriever(documents, self.config)
        self.hybrid_retriever = build_hybrid_retriever(self.vectorstore, self.bm25_retriever, self.config)
        save_documents_cache(documents)
        print("🎉 Ingestion terminée, pipeline prêt.")

    def retrieve(self, query: str, verbose: bool = False) -> List[Document]:
        """Pipeline de récupération complet :
        multi-query -> hybrid search (ou vecteur seul) -> RRF -> reranking."""
        query_variations = generate_query_variations(self.llm, query, self.config.num_query_variations)
        if verbose:
            print(f"[Multi-query] {len(query_variations)} variantes générées.")

        retriever = self.hybrid_retriever or (
            self.vectorstore.as_retriever(search_kwargs={"k": self.config.vector_k})
            if self.vectorstore else None
        )
        if retriever is None:
            raise RuntimeError("Aucun retriever disponible : ingère d'abord des documents.")

        all_results = [retriever.invoke(q) for q in query_variations]

        fused = reciprocal_rank_fusion(all_results, k=self.config.rrf_k, verbose=verbose)
        fused_docs = [doc for doc, _ in fused]

        reranked = rerank_documents(query, fused_docs, self.config)
        if verbose:
            print(f"[Retrieval] {len(fused_docs)} chunks fusionnés -> {len(reranked)} après reranking.")
        return reranked

    # ---------------------- CONVERSATION ----------------------

    def ask(self, question: str, verbose: bool = False) -> str:
        """Pose une question au pipeline complet, en tenant compte de
        l'historique de conversation."""
        standalone_question = contextualize_question(self.llm, self.chat_history, question)
        if verbose and standalone_question != question:
            print(f"[Historique] Question reformulée : {standalone_question}")

        documents = self.retrieve(standalone_question, verbose=verbose)
        answer = generate_answer(standalone_question, documents, self.config)

        self.chat_history.append(HumanMessage(content=question))
        self.chat_history.append(AIMessage(content=answer))
        return answer

    def chat_loop(self):
        """Boucle de chat interactive en ligne de commande."""
        print("Pose tes questions ! Tape 'quit' pour sortir.")
        while True:
            question = input("\nTa question : ")
            if question.strip().lower() == "quit":
                print("Au revoir !")
                break
            answer = self.ask(question, verbose=True)
            print(f"\nRéponse : {answer}")


# ================================================================
# 10. POINT D'ENTRÉE CLI
# ================================================================

def main():
    if len(sys.argv) < 2:
        print(__doc__)
        return

    command = sys.argv[1]
    pipeline = RAGPipeline()

    if command == "ingest":
        if len(sys.argv) < 3:
            print("Usage : python rag_pipeline.py ingest <dossier_txt_ou_fichier.pdf>")
            return
        pipeline.ingest(sys.argv[2])

    elif command == "chat":
        # Recharge la base persistée. Pour le hybrid search complet (BM25),
        # ré-ingère au préalable dans la même session ou adapte load_existing()
        # pour repasser les documents originaux.
        pipeline.load_existing()
        pipeline.chat_loop()

    else:
        print(f"Commande inconnue : {command}")
        print(__doc__)


if __name__ == "__main__":
    main()