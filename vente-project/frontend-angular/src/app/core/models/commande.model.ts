export interface LigneCommande {
  id?: number;
  produit: { id: number; nom: string };
  quantite: number;
  prixUnitaire: number;
}

export interface Commande {
  id: number;
  utilisateur: { id: number; nom: string; prenom: string; email: string };
  dateCommande: string;
  total: number;
  statut: string;
  lignes: LigneCommande[];
}