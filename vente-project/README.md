# 🛍️ VenteShop — Projet e-commerce (Angular + Spring Boot + MySQL)

## 📁 Structure du projet
```
vente-project/
├── frontend-angular/       → Application Angular (à ouvrir dans VSCode)
├── backend-springboot/     → API Spring Boot (à ouvrir dans IntelliJ)
└── database/
    └── vente_db.sql        → Script à exécuter dans MySQL Workbench
```

## 1️⃣ Base de données (MySQL Workbench)
1. Ouvrir MySQL Workbench, se connecter à votre instance locale.
2. Ouvrir et exécuter le fichier `database/vente_db.sql` (crée la base `vente_db`, les tables et des données de démo).

## 2️⃣ Backend (IntelliJ IDEA)
1. Ouvrir le dossier `backend-springboot` comme projet Maven.
2. Modifier `src/main/resources/application.properties` si besoin (utilisateur/mot de passe MySQL).
3. Lancer `VenteApplication.java` → API disponible sur **http://localhost:8080/api**

Endpoints principaux :
- `GET /api/produits` — liste des produits
- `GET /api/produits/{id}` — détail produit
- `GET /api/produits/categorie/{id}` — produits par catégorie
- `GET /api/produits/recherche?nom=...` — recherche
- `GET /api/categories` — liste des catégories
- `POST /api/auth/login` / `POST /api/auth/register`

## 3️⃣ Frontend (VSCode)
```bash
cd frontend-angular
npm install
npm start
```
→ Application disponible sur **http://localhost:4200**

## 📄 Pages incluses
| Page | Route | Contenu |
|---|---|---|
| En-tête (partout) | — | Logo, barre de recherche, login, panier |
| Accueil | `/` | Bannière, avantages, catégories, produits populaires, bandeau promo |
| Catégories | `/categories` | Liste de toutes les catégories |
| Détail catégorie | `/categories/:id` | Produits de la catégorie (image, prix, description) |
| Détail produit | `/produit/:id` | Fiche produit + ajout au panier |
| À propos | `/a-propos` | Présentation + "Le saviez-vous ?" |
| Localisation | `/localisation` | Carte + adresse + horaires |
| Connexion | `/login` | Connexion / inscription |
| Panier | `/panier` | Articles ajoutés + total |
| Agent IA | Widget flottant | Chat assistant (à connecter à un vrai service IA) |

## 🔧 Prochaines étapes recommandées (niveau professionnel)
- Sécuriser l'authentification avec **Spring Security + JWT**.
- Hasher les mots de passe avec **BCrypt**.
- Ajouter la pagination sur `/api/produits`.
- Uploader de vraies images (stockage local ou cloud type S3/Cloudinary).
- Ajouter une gestion des commandes (`Commande`, `LigneCommande`).
- Déployer : backend sur un serveur (Docker), frontend sur Vercel/Netlify, DB sur un service managé.
