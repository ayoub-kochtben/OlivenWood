import { Category } from '../models/category.model';
import { Product } from '../models/product.model';

export const CATEGORIES: Category[] = [
  {
    id: 1,
    nom: 'Planches & DÃ©coupe',
    description: "Planches Ã  dÃ©couper, Ã  pizza et Ã  saucisson en bois d'olivier massif.",
    imageUrl: 'assets/images/planche.webp'
  },
  {
    id: 2,
    nom: 'Bols & BoÃ®tes',
    description: "Bols, corbeilles et boÃ®tes en bois d'olivier pour la table et la cuisine.",
    imageUrl: 'assets/images/bols-bois-olivier-10-12-14.webp'
  },
  {
    id: 3,
    nom: 'Couverts & Ustensiles',
    description: "CuillÃ¨res, fourchettes et spatules sculptÃ©es en bois d'olivier.",
    imageUrl: 'assets/images/spatule1.webp'
  },
  {
    id: 4,
    nom: 'DÃ©cor & Jeux',
    description: "Objets de dÃ©coration et jeux en bois d'olivier, piÃ¨ces uniques.",
    imageUrl: 'assets/images/jeu-dechec.webp'
  }
];

export const PRODUITS: Product[] = [
  // ===== Planches & DÃ©coupe =====
  {
    id: 1,
    nom: "Planche Ã  dÃ©couper en bois d'olivier",
    description:
      "Planche Ã  dÃ©couper en olivier massif, veinage unique et finition huilÃ©e. IdÃ©ale pour dÃ©couper et servir.",
    prix: 29.9,
    images: [{ url: 'assets/images/planche.webp' }],
    longueur: 30,
    largeur: 20,
    categorieId: 1,
    categorieNom: 'Planches & DÃ©coupe'
  },
  {
    id: 2,
    nom: "Planche Ã  pizza en bois d'olivier",
    description:
      "Planche ronde en olivier pour prÃ©senter et dÃ©couper vos pizzas, rÃ©sistante et Ã©lÃ©gante.",
    prix: 34.9,
    images: [{ url: 'assets/images/planche-a-pizza-en-bois-dolivier.webp' }],
    diametre: 35,
    categorieId: 1,
    categorieNom: 'Planches & DÃ©coupe'
  },
  {
    id: 3,
    nom: "Planche Ã  bouteille en bois d'olivier",
    description:
      "Planche de prÃ©sentation allongÃ©e, parfaite pour servir une bouteille et ses accompagnements.",
    prix: 24.9,
    images: [{ url: 'assets/images/planche-bouteille.webp' }],
    longueur: 35,
    largeur: 12,
    categorieId: 1,
    categorieNom: 'Planches & DÃ©coupe'
  },
  {
    id: 4,
    nom: 'Planche Camargue 22',
    description:
      "Planche compacte en olivier, format pratique pour le quotidien ou les apÃ©ritifs entre amis.",
    prix: 27.9,
    images: [{ url: 'assets/images/planche-camargue-22.webp' }],
    longueur: 22,
    largeur: 14,
    categorieId: 1,
    categorieNom: 'Planches & DÃ©coupe'
  },
  {
    id: 5,
    nom: "Planche Ã  saucisson en bois d'olivier",
    description:
      "Planche de service dÃ©diÃ©e aux charcuteries, bord plein et veinage naturel de l'olivier.",
    prix: 22.9,
    images: [{ url: 'assets/images/planche-saucisson.webp' }],
    longueur: 28,
    largeur: 16,
    categorieId: 1,
    categorieNom: 'Planches & DÃ©coupe'
  },

  // ===== Bols & BoÃ®tes =====
  {
    id: 6,
    nom: "Bol en bois d'olivier 10 cm",
    description:
      "Petit bol tournÃ© dans l'olivier massif, idÃ©al pour sauces, Ã©pices ou olives.",
    prix: 14.9,
    images: [{ url: 'assets/images/bol-bois-olivier-10cm.webp' }],
    diametre: 10,
    categorieId: 2,
    categorieNom: 'Bols & BoÃ®tes'
  },
  {
    id: 7,
    nom: "Bol en bois d'olivier 12 cm",
    description:
      "Bol polyvalent de taille moyenne, chaque piÃ¨ce est unique par ses veines naturelles.",
    prix: 17.9,
    images: [{ url: 'assets/images/bol-bois-olivier-12cm.webp' }],
    diametre: 12,
    categorieId: 2,
    categorieNom: 'Bols & BoÃ®tes'
  },
  {
    id: 8,
    nom: "Bol en bois d'olivier 14 cm",
    description:
      "Grand bol en olivier pour salades et prÃ©parations du quotidien, finition huilÃ©e alimentaire.",
    prix: 21.9,
    images: [{ url: 'assets/images/bol-bois-olivier-14cm.webp' }],
    diametre: 14,
    categorieId: 2,
    categorieNom: 'Bols & BoÃ®tes'
  },
  {
    id: 9,
    nom: "BoÃ®te Ã  sel en bois d'olivier",
    description:
      "BoÃ®te Ã  sel avec couvercle ajustÃ©, garde la fraÃ®cheur et habille votre plan de travail.",
    prix: 19.9,
    images: [
      { url: 'assets/images/boite-a-sel-en-bois-d-olivier-1.webp' },
      { url: 'assets/images/boite-a-sel-en-bois-d-olivier-2.webp' }
    ],
    largeur: 12,
    hauteur: 8,
    categorieId: 2,
    categorieNom: 'Bols & BoÃ®tes'
  },
  {
    id: 10,
    nom: "Corbeille en bois d'olivier",
    description:
      "Corbeille sculptÃ©e Ã  la main pour prÃ©senter fruits et pain, piÃ¨ce dÃ©corative et pratique.",
    prix: 49.9,
    images: [{ url: 'assets/images/corbeille.webp' }],
    largeur: 30,
    hauteur: 12,
    categorieId: 2,
    categorieNom: 'Bols & BoÃ®tes'
  },

  // ===== Couverts & Ustensiles =====
  {
    id: 11,
    nom: "CuillÃ¨re en bois d'olivier",
    description:
      "CuillÃ¨re de service en olivier, ergonomique et douce pour vos poÃªles et plats.",
    prix: 9.9,
    images: [{ url: 'assets/images/cuillere1.webp' }],
    longueur: 28,
    categorieId: 3,
    categorieNom: 'Couverts & Ustensiles'
  },
  {
    id: 12,
    nom: "Petite cuillÃ¨re en bois d'olivier",
    description:
      "CuillÃ¨re fine pour pots, condiments et Ã©pices, faÃ§onnÃ©e d'une seule piÃ¨ce.",
    prix: 7.9,
    images: [{ url: 'assets/images/cuillere2.webp' }],
    longueur: 20,
    categorieId: 3,
    categorieNom: 'Couverts & Ustensiles'
  },
  {
    id: 13,
    nom: "Fourchette en bois d'olivier",
    description:
      "Fourchette de service robuste en olivier massif, parfaite pour retourner et servir.",
    prix: 9.9,
    images: [{ url: 'assets/images/fourchette1.webp' }],
    longueur: 28,
    categorieId: 3,
    categorieNom: 'Couverts & Ustensiles'
  },
  {
    id: 14,
    nom: "Fourchette de service en bois d'olivier",
    description:
      "Grande fourchette Ã  deux dents pour les grandes piÃ¨ces, finition polie main.",
    prix: 10.9,
    images: [{ url: 'assets/images/fourchette2.webp' }],
    longueur: 30,
    categorieId: 3,
    categorieNom: 'Couverts & Ustensiles'
  },
  {
    id: 15,
    nom: "Spatule en bois d'olivier",
    description:
      "Spatule polyvalente pour cuisiner sans rayer vos ustensiles, bois naturellement antibactÃ©rien.",
    prix: 9.9,
    images: [{ url: 'assets/images/spatule1.webp' }],
    longueur: 28,
    categorieId: 3,
    categorieNom: 'Couverts & Ustensiles'
  },
  {
    id: 16,
    nom: "Spatule large en bois d'olivier",
    description:
      "Spatule Ã  bord large pour retourner crÃªpes, oeufs et poissons avec prÃ©cision.",
    prix: 11.9,
    images: [{ url: 'assets/images/spatule2.webp' }],
    longueur: 30,
    categorieId: 3,
    categorieNom: 'Couverts & Ustensiles'
  },
  {
    id: 17,
    nom: "Spatule Ã  pÃ¢te Ã  tartiner en olivier",
    description:
      "Spatule plate conÃ§ue pour tartiner beurres, confitures et pÃ¢tes Ã  tartiner.",
    prix: 8.9,
    images: [{ url: 'assets/images/spatule-pate-tartiner-bois-olivier2.webp' }],
    longueur: 22,
    categorieId: 3,
    categorieNom: 'Couverts & Ustensiles'
  },
  {
    id: 18,
    nom: "Spatule Ã  pizza en bois d'olivier",
    description:
      "Spatule dÃ©diÃ©e Ã  la pizza, manche court et bord renforcÃ© pour servir sans effort.",
    prix: 12.9,
    images: [{ url: 'assets/images/spatule-pizza-1.webp' }],
    longueur: 26,
    categorieId: 3,
    categorieNom: 'Couverts & Ustensiles'
  },

  // ===== DÃ©cor & Jeux =====
  {
    id: 19,
    nom: "Jeu d'Ã©checs en bois d'olivier",
    description:
      "Jeu d'Ã©checs complet sculptÃ© en olivier, piÃ¨ces tournÃ©es main et plateau veinÃ©. PiÃ¨ce unique.",
    prix: 89.9,
    images: [{ url: 'assets/images/jeu-dechec.webp' }],
    largeur: 40,
    hauteur: 6,
    categorieId: 4,
    categorieNom: 'DÃ©cor & Jeux'
  }
];
