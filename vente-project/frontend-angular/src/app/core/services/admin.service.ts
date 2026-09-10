import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Commande } from '../models/commande.model';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getCommandes(): Observable<Commande[]> {
    return this.http.get<Commande[]>(`${this.apiUrl}/commandes`);
  }

  changerStatutCommande(id: number, statut: string): Observable<Commande> {
    return this.http.put<Commande>(`${this.apiUrl}/commandes/${id}/statut`, { statut });
  }

  getUtilisateurs(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/utilisateurs`);
  }
}