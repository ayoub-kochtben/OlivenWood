import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CartItem } from '../models/user.model';
import { GuestSessionService } from './guest-session.service';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CartService {
  private apiUrl = `${environment.apiUrl}/panier`;

  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  items$ = this.itemsSubject.asObservable();

  constructor(private http: HttpClient, private guestSession: GuestSessionService) {
    this.charger();
  }

  private getIdParams(): any {
    const utilisateurId = this.getUtilisateurId();
    return utilisateurId
      ? { utilisateurId }
      : { sessionId: this.guestSession.getSessionId() };
  }

  private getUtilisateurId(): number | null {
    const raw = localStorage.getItem('utilisateurId');
    return raw ? Number(raw) : null;
  }

  charger(): void {
    this.http.get<any[]>(this.apiUrl, { params: this.getIdParams() }).subscribe(res => {
      const items: CartItem[] = res.map(r => ({ id: r.id, produit: r.produit, quantite: r.quantite }));
      this.itemsSubject.next(items);
    });
  }
  ajouter(produitId: number, quantite: number = 1): void {
    this.http.post(`${this.apiUrl}/ajouter`, { produitId, quantite }, { params: this.getIdParams() })
      .subscribe(() => this.charger());
  }

  modifierQuantite(itemId: number, quantite: number): void {
    this.http.put(`${this.apiUrl}/${itemId}`, null, { params: { quantite } })
      .subscribe(() => this.charger());
  }

  retirer(itemId: number): void {
    this.http.delete(`${this.apiUrl}/${itemId}`).subscribe(() => this.charger());
  }

  fusionnerApresLogin(utilisateurId: number): void {
    const sessionId = this.guestSession.getSessionId();
    this.http.post(`${this.apiUrl}/fusionner`, null, { params: { sessionId, utilisateurId } })
      .subscribe(() => {
        localStorage.setItem('utilisateurId', String(utilisateurId));
        this.guestSession.clear();
        this.charger();
      });
  }

  getTotal(): number {
    return this.itemsSubject.value.reduce((sum, i) => sum + i.produit.prix * i.quantite, 0);
  }

  getNombreArticles(): number {
    return this.itemsSubject.value.reduce((sum, i) => sum + i.quantite, 0);
  }
}