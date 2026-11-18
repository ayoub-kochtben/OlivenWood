import { Injectable } from '@angular/core';
import { PRODUITS } from '../data/site-data';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {

  getAll(): Product[] {
    return PRODUITS;
  }

  getById(id: number): Product | undefined {
    return PRODUITS.find(p => p.id === id);
  }

  getByCategorie(categorieId: number): Product[] {
    return PRODUITS.filter(p => p.categorieId === categorieId);
  }

  search(motCle: string): Product[] {
    const cle = motCle.trim().toLowerCase();
    if (!cle) {
      return [];
    }
    return PRODUITS.filter(p =>
      p.nom.toLowerCase().includes(cle) ||
      p.description.toLowerCase().includes(cle)
    );
  }
}
