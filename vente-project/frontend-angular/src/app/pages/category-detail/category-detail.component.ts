import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { Product } from '../../core/models/product.model';
import { Category } from '../../core/models/category.model';

@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.scss']
})
export class CategoryDetailComponent implements OnInit, OnDestroy {
  categorie?: Category;
  produits: Product[] = [];

  private routeSub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    // S'abonne à CHAQUE changement de paramètre dans l'URL
    // (au lieu de lire l'id une seule fois avec route.snapshot)
    this.routeSub = this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));

      if (id) {
        this.chargerCategorie(id);
      }
    });
  }

  private chargerCategorie(id: number): void {
    this.categoryService.getById(id).subscribe(res => this.categorie = res);
    this.productService.getByCategorie(id).subscribe(res => this.produits = res);
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }
}