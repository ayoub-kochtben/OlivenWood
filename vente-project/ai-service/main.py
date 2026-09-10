"""
API HTTP pour le RAG pipeline — exposée au backend Spring Boot.
"""
from rag_pipeline import RAGPipeline, load_documents_cache

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from rag_pipeline import RAGPipeline

app = FastAPI(title="Oliven Wood - AI Service")

# CORS : uniquement nécessaire si tu changes d'avis et appelles depuis Angular directement.
# En passant par Spring Boot (serveur à serveur), ce n'est pas requis, mais on le laisse
# large pour faciliter les tests directs (ex: via Postman ou curl) pendant le développement.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

pipeline = RAGPipeline()
pipeline_ready = False


class ChatRequest(BaseModel):
    question: str


class ChatResponse(BaseModel):
    answer: str



@app.on_event("startup")
def startup():
    global pipeline_ready
    try:
        cached_docs = load_documents_cache()
        pipeline.load_existing(documents_for_bm25=cached_docs)
        pipeline_ready = True
        print("✅ Base vectorielle chargée, service prêt.")
    except Exception as e:
        print(f"⚠️ Aucune base existante trouvée ({e}). Lance d'abord l'ingestion.")

@app.get("/health")
def health():
    return {"status": "ok", "pipeline_ready": pipeline_ready}


@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    if not pipeline_ready:
        return ChatResponse(answer="Le service IA n'a pas encore de documents ingérés. Contactez l'administrateur.")
    answer = pipeline.ask(req.question, verbose=True)
    return ChatResponse(answer=answer)