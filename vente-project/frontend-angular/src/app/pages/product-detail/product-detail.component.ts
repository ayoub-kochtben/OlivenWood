import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  produit?: Product;
  produitsSimilaires: Product[] = [];
  imageActive = 'assets/images/placeholder.png';

  whatsappUrl = 'https://wa.me/21650124331';

  private routeSub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
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
    const produit = this.productService.getById(id);
    if (!produit) {
      this.produit = undefined;
      this.produitsSimilaires = [];
      return;
    }

    this.produit = produit;
    this.imageActive = produit.images?.length
      ? produit.images[0].url
      : 'assets/images/placeholder.png';

    const message = encodeURIComponent(
      `Bonjour, je suis intéressé(e) par : ${produit.nom} (${produit.prix.toFixed(2)} €).`
    );
    this.whatsappUrl = `https://wa.me/21650124331?text=${message}`;

    this.produitsSimilaires = produit.categorieId
      ? this.productService.getByCategorie(produit.categorieId).filter(p => p.id !== produit.id)
      : [];
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }
}
