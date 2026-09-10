import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = `${environment.apiUrl}/produits`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  getByCategorie(categorieId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/categorie/${categorieId}`);
  }

  search(motCle: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/recherche?nom=${motCle}`);
  }
  create(produit: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, produit);
  }

  update(id: number, produit: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, produit);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
