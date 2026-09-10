import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiUrl = `${environment.apiUrl}/commandes`;

  constructor(private http: HttpClient) {}

  creerCommande(utilisateurId: number): Observable<any> {
    return this.http.post(this.apiUrl, null, { params: { utilisateurId } });
  }

  mesCommandes(utilisateurId: number): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { params: { utilisateurId } });
  }
}