import { Category } from '../models/category.model';
import { Product } from '../models/product.model';

export const CATEGORIES: Category[] = [
  {
    id: 1,
    nom: 'Planches & Découpe',
    description: "Planches à découper, à pizza et à saucisson en bois d'olivier massif.",
    imageUrl: 'assets/images/planche.png'
  },
  {
    id: 2,
    nom: 'Bols & Boîtes',
    description: "Bols, corbeilles et boîtes en bois d'olivier pour la table et la cuisine.",
    imageUrl: 'assets/images/bols-bois-olivier-10-12-14.png'
  },
  {
    id: 3,
    nom: 'Couverts & Ustensiles',
    description: "Cuillères, fourchettes et spatules sculptées en bois d'olivier.",
    imageUrl: 'assets/images/spatule1.png'
  },
  {
    id: 4,
    nom: 'Décor & Jeux',
    description: "Objets de décoration et jeux en bois d'olivier, pièces uniques.",
    imageUrl: 'assets/images/jeu-dechec.png'
  }
];

export const PRODUITS: Product[] = [
  // ===== Planches & Découpe =====
  {
    id: 1,
    nom: "Planche à découper en bois d'olivier",
    description:
      "Planche à découper en olivier massif, veinage unique et finition huilée. Idéale pour découper et servir.",
    prix: 29.9,
    images: [{ url: 'assets/images/planche.png' }],
    longueur: 30,
    largeur: 20,
    categorieId: 1,
    categorieNom: 'Planches & Découpe'
  },
  {
    id: 2,
    nom: "Planche à pizza en bois d'olivier",
    description:
      "Planche ronde en olivier pour présenter et découper vos pizzas, résistante et élégante.",
    prix: 34.9,
    images: [{ url: 'assets/images/planche-a-pizza-en-bois-dolivier.png' }],
    diametre: 35,
    categorieId: 1,
    categorieNom: 'Planches & Découpe'
  },
  {
    id: 3,
    nom: "Planche à bouteille en bois d'olivier",
    description:
      "Planche de présentation allongée, parfaite pour servir une bouteille et ses accompagnements.",
    prix: 24.9,
    images: [{ url: 'assets/images/planche-bouteille.png' }],
    longueur: 35,
    largeur: 12,
    categorieId: 1,
    categorieNom: 'Planches & Découpe'
  },
  {
    id: 4,
    nom: 'Planche Camargue 22',
    description:
      "Planche compacte en olivier, format pratique pour le quotidien ou les apéritifs entre amis.",
    prix: 27.9,
    images: [{ url: 'assets/images/planche-camargue-22.png' }],
    longueur: 22,
    largeur: 14,
    categorieId: 1,
    categorieNom: 'Planches & Découpe'
  },
  {
    id: 5,
    nom: "Planche à saucisson en bois d'olivier",
    description:
      "Planche de service dédiée aux charcuteries, bord plein et veinage naturel de l'olivier.",
    prix: 22.9,
    images: [{ url: 'assets/images/planche-saucisson.png' }],
    longueur: 28,
    largeur: 16,
    categorieId: 1,
    categorieNom: 'Planches & Découpe'
  },

  // ===== Bols & Boîtes =====
  {
    id: 6,
    nom: "Bol en bois d'olivier 10 cm",
    description:
      "Petit bol tourné dans l'olivier massif, idéal pour sauces, épices ou olives.",
    prix: 14.9,
    images: [{ url: 'assets/images/bol-bois-olivier-10cm.webp' }],
    diametre: 10,
    categorieId: 2,
    categorieNom: 'Bols & Boîtes'
  },
  {
    id: 7,
    nom: "Bol en bois d'olivier 12 cm",
    description:
      "Bol polyvalent de taille moyenne, chaque pièce est unique par ses veines naturelles.",
    prix: 17.9,
    images: [{ url: 'assets/images/bol-bois-olivier-12cm.webp' }],
    diametre: 12,
    categorieId: 2,
    categorieNom: 'Bols & Boîtes'
  },
  {
    id: 8,
    nom: "Bol en bois d'olivier 14 cm",
    description:
      "Grand bol en olivier pour salades et préparations du quotidien, finition huilée alimentaire.",
    prix: 21.9,
    images: [{ url: 'assets/images/bol-bois-olivier-14cm.webp' }],
    diametre: 14,
    categorieId: 2,
    categorieNom: 'Bols & Boîtes'
  },
  {
    id: 9,
    nom: "Boîte à sel en bois d'olivier",
    description:
      "Boîte à sel avec couvercle ajusté, garde la fraîcheur et habille votre plan de travail.",
    prix: 19.9,
    images: [
      { url: 'assets/images/boite-a-sel-en-bois-d-olivier-1.png' },
      { url: 'assets/images/boite-a-sel-en-bois-d-olivier-2.png' }
    ],
    largeur: 12,
    hauteur: 8,
    categorieId: 2,
    categorieNom: 'Bols & Boîtes'
  },
  {
    id: 10,
    nom: "Corbeille en bois d'olivier",
    description:
      "Corbeille sculptée à la main pour présenter fruits et pain, pièce décorative et pratique.",
    prix: 49.9,
    images: [{ url: 'assets/images/corbeille.png' }],
    largeur: 30,
    hauteur: 12,
    categorieId: 2,
    categorieNom: 'Bols & Boîtes'
  },

  // ===== Couverts & Ustensiles =====
  {
    id: 11,
    nom: "Cuillère en bois d'olivier",
    description:
      "Cuillère de service en olivier, ergonomique et douce pour vos poêles et plats.",
    prix: 9.9,
    images: [{ url: 'assets/images/cuillere1.png' }],
    longueur: 28,
    categorieId: 3,
    categorieNom: 'Couverts & Ustensiles'
  },
  {
    id: 12,
    nom: "Petite cuillère en bois d'olivier",
    description:
      "Cuillère fine pour pots, condiments et épices, façonnée d'une seule pièce.",
    prix: 7.9,
    images: [{ url: 'assets/images/cuillere2.png' }],
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
    images: [{ url: 'assets/images/fourchette1.png' }],
    longueur: 28,
    categorieId: 3,
    categorieNom: 'Couverts & Ustensiles'
  },
  {
    id: 14,
    nom: "Fourchette de service en bois d'olivier",
    description:
      "Grande fourchette à deux dents pour les grandes pièces, finition polie main.",
    prix: 10.9,
    images: [{ url: 'assets/images/fourchette2.png' }],
    longueur: 30,
    categorieId: 3,
    categorieNom: 'Couverts & Ustensiles'
  },
  {
    id: 15,
    nom: "Spatule en bois d'olivier",
    description:
      "Spatule polyvalente pour cuisiner sans rayer vos ustensiles, bois naturellement antibactérien.",
    prix: 9.9,
    images: [{ url: 'assets/images/spatule1.png' }],
    longueur: 28,
    categorieId: 3,
    categorieNom: 'Couverts & Ustensiles'
  },
  {
    id: 16,
    nom: "Spatule large en bois d'olivier",
    description:
      "Spatule à bord large pour retourner crêpes, oeufs et poissons avec précision.",
    prix: 11.9,
    images: [{ url: 'assets/images/spatule2.png' }],
    longueur: 30,
    categorieId: 3,
    categorieNom: 'Couverts & Ustensiles'
  },
  {
    id: 17,
    nom: "Spatule à pâte à tartiner en olivier",
    description:
      "Spatule plate conçue pour tartiner beurres, confitures et pâtes à tartiner.",
    prix: 8.9,
    images: [{ url: 'assets/images/spatule-pate-tartiner-bois-olivier2.png' }],
    longueur: 22,
    categorieId: 3,
    categorieNom: 'Couverts & Ustensiles'
  },
  {
    id: 18,
    nom: "Spatule à pizza en bois d'olivier",
    description:
      "Spatule dédiée à la pizza, manche court et bord renforcé pour servir sans effort.",
    prix: 12.9,
    images: [{ url: 'assets/images/spatule-pizza-1.png' }],
    longueur: 26,
    categorieId: 3,
    categorieNom: 'Couverts & Ustensiles'
  },

  // ===== Décor & Jeux =====
  {
    id: 19,
    nom: "Jeu d'échecs en bois d'olivier",
    description:
      "Jeu d'échecs complet sculpté en olivier, pièces tournées main et plateau veiné. Pièce unique.",
    prix: 89.9,
    images: [{ url: 'assets/images/jeu-dechec.png' }],
    largeur: 40,
    hauteur: 6,
    categorieId: 4,
    categorieNom: 'Décor & Jeux'
  }
];
