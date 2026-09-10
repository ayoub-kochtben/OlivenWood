import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ContactPayload {
  nom: string;
  email: string;
  sujet: string;
  message: string;
  destinataire: string;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  private apiUrl = `${environment.apiUrl}/contact`; // adapte selon la config existante de tes autres services

  constructor(private http: HttpClient) {}

  envoyer(payload: ContactPayload): Observable<any> {
    return this.http.post(this.apiUrl, payload);
  }
}