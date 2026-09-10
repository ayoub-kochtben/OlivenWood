import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  modeInscription = false;

  email = '';
  motDePasse = '';
  nom = '';
  prenom = '';
  erreur = '';

  private returnUrl = '/';

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  seConnecter(): void {
    this.authService.login(this.email, this.motDePasse).subscribe({
      next: (user) => {
        if (user.id) {
          this.cartService.fusionnerApresLogin(user.id);
        }
        this.router.navigateByUrl(this.returnUrl);
      },
      error: () => this.erreur = 'Email ou mot de passe incorrect.'
    });
  }

  sInscrire(): void {
    this.authService.register({
      nom: this.nom, prenom: this.prenom, email: this.email, motDePasse: this.motDePasse
    }).subscribe({
      next: () => this.modeInscription = false,
      error: () => this.erreur = "Erreur lors de l'inscription."
    });
  }
}