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
    this.routeSub = this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.chargerCategorie(id);
      }
    });
  }

  private chargerCategorie(id: number): void {
    this.categorie = this.categoryService.getById(id);
    this.produits = this.productService.getByCategorie(id);
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }
}
