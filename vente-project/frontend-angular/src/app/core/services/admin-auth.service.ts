import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminAuthService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<{ success: boolean; message?: string }> {
    return this.http.post<{ success: boolean; message?: string }>(`${this.apiUrl}/login`, { username, password })
      .pipe(tap(res => {
        if (res.success) {
          localStorage.setItem('admin_connecte', 'true');
        }
      }));
  }

  logout(): void {
    localStorage.removeItem('admin_connecte');
  }

  isConnecte(): boolean {
    return localStorage.getItem('admin_connecte') === 'true';
  }
}