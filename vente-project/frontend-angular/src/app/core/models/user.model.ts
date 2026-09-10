export interface User {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  motDePasse?: string;
  token?: string;
}

export interface CartItem {
  id?: number; // id de la ligne PanierItem en base — doit être présent
  produit: import('./product.model').Product;
  quantite: number;
}