import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(email: string, motDePasse: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, { email, motDePasse })
      .pipe(tap(user => {
        localStorage.setItem('token', user.token || '');
        if (user.id) {
          localStorage.setItem('utilisateurId', String(user.id));
        }
      }));
  }

  register(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, user);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('utilisateurId');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getUtilisateurId(): number | null {
    const raw = localStorage.getItem('utilisateurId');
    return raw ? Number(raw) : null;
  }
}