import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  produit?: Product;
  produitsSimilaires: Product[] = [];
  quantite = 1;
  imageActive = 'assets/images/placeholder.png';

  private routeSub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.chargerProduit(id);
      }
    });
  }

  private chargerProduit(id: number): void {
    this.productService.getById(id).subscribe(res => {
      this.produit = res;
      this.quantite = 1;

      if (res.images && res.images.length > 0) {
        this.imageActive = res.images[0].url;
      } else {
        this.imageActive = 'assets/images/placeholder.png';
      }

      if (res.categorieId !== undefined && res.categorieId !== null) {
        this.productService.getByCategorie(res.categorieId).subscribe(produits => {
          this.produitsSimilaires = produits.filter(
            p => Number(p.id) !== Number(res.id)
          );
        });
      } else {
        this.produitsSimilaires = [];
      }
    });
  }

  ajouterAuPanier(): void {
    if (this.produit) {
      this.cartService.ajouter(this.produit.id, this.quantite);
    }
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }
}