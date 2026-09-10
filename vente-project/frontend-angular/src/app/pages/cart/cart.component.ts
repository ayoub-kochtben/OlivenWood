import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { OrderService } from '../../core/services/order.service';
import { CartItem } from '../../core/models/user.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  items: CartItem[] = [];
  enTraitement = false;
  erreur = '';

  constructor(
    public cartService: CartService,
    private authService: AuthService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.items$.subscribe(res => this.items = res);
  }

  retirer(itemId: number): void {
    this.cartService.retirer(itemId);
  }

  changerQuantite(itemId: number, quantite: number): void {
    if (quantite < 1) { quantite = 1; }
    this.cartService.modifierQuantite(itemId, quantite);
  }

  get total(): number {
    return this.cartService.getTotal();
  }

  get nombreArticles(): number {
    return this.cartService.getNombreArticles();
  }

  passerCommande(): void {
    this.erreur = '';

    if (!this.authService.isLoggedIn()) {
      // Redirige vers le login, en gardant l'intention de revenir au panier
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/panier' } });
      return;
    }

    const utilisateurId = this.authService.getUtilisateurId();
    if (!utilisateurId) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/panier' } });
      return;
    }

    this.enTraitement = true;
    this.orderService.creerCommande(utilisateurId).subscribe({
      next: () => {
        this.enTraitement = false;
        this.cartService.charger(); // recharge le panier (désormais vide)
        this.router.navigate(['/'], { queryParams: { commandeConfirmee: true } });
      },
      error: () => {
        this.enTraitement = false;
        this.erreur = "Une erreur est survenue lors de la commande. Réessayez.";
      }
    });
  }
}