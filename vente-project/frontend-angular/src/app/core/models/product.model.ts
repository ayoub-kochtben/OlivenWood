export interface ProductImage {
  id?: number;
  url: string;
}

export interface Product {
  id: number;
  nom: string;
  description: string;
  prix: number;
  images: ProductImage[];
  largeur?: number;
  hauteur?: number;
  diametre?: number;
  longueur?: number;
  categorieId: number;
  categorieNom?: string;
}