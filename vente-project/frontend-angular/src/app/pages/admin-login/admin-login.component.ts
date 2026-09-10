import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminAuthService } from '../../core/services/admin-auth.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent {
  username = '';
  password = '';
  erreur = '';
  chargement = false;

  constructor(private adminAuth: AdminAuthService, private router: Router) {}

  seConnecter(): void {
    this.chargement = true;
    this.erreur = '';
    this.adminAuth.login(this.username, this.password).subscribe({
      next: (res) => {
        this.chargement = false;
        if (res.success) {
          this.router.navigate(['/admin']);
        } else {
          this.erreur = res.message || 'Identifiants incorrects';
        }
      },
      error: () => {
        this.chargement = false;
        this.erreur = 'Erreur de connexion au serveur.';
      }
    });
  }
}