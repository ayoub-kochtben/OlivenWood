# Oliven Wood — Site vitrine 100% statique (Angular)

Site de présentation de créations en bois d'olivier. Aucun backend requis : le catalogue est stocké en dur dans le frontend, le site se déploie sur n'importe quel hébergeur statique (Netlify, Vercel, GitHub Pages...).

## 📁 Structure
```
vente-project/
├── frontend-angular/    → Application Angular statique
└── ai-service/          → Service IA (FastAPI) du chatbot
```

## 🚀 Lancer en local
```bash
cd frontend-angular
npm install
npm start
```
→ Application disponible sur **http://localhost:4200**

## 📦 Build de production
```bash
npm run build
```
→ Résultat dans `dist/vente-frontend` (fichiers statiques à déployer).

## 🗂 Données du catalogue
Les produits et catégories sont définis dans :
`src/app/core/data/site-data.ts`

Pour ajouter/modifier un produit ou une catégorie, éditez simplement ce fichier (les images se trouvent dans `src/assets/images`).

## 📄 Pages
| Page | Route | Contenu |
|---|---|---|
| Accueil | `/` | Bannière, créations, histoire (carrousel) |
| Catégories | `/categories` | Liste des catégories |
| Détail catégorie | `/categories/:id` | Produits de la catégorie |
| Détail produit | `/produit/:id` | Fiche produit + commande via WhatsApp |
| À propos / Contact | `/a-propos` | Présentation, carte, formulaire de contact (FormSubmit) |
| Localisation | `/localisation` | Carte + itinéraire |
| Chatbot IA | Widget flottant | Assistant conversationnel |

## 🤖 Chatbot IA (optionnel)
Le widget affiché en bas de page interroge le service `ai-service` (FastAPI + RAG). Pour le faire fonctionner :
```bash
cd ai-service
pip install -r requirements.txt
uvicorn main:app --port 8000
```
L'URL du service est définie par la constante `AI_SERVICE_URL` dans `src/app/shared/components/ai-agent/ai-agent.component.ts` (à adapter en production). Sans ce service, le site reste entièrement fonctionnel.

## 🛒 Commande (sans panier)
Le site est vitrine : sur chaque fiche produit, un bouton **« Commander via WhatsApp »** ouvre une conversation pré-remplie avec le nom et le prix du produit.
