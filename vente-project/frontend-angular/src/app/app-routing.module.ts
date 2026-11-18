import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { CategoryComponent } from './pages/category/category.component';
import { CategoryDetailComponent } from './pages/category-detail/category-detail.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { AboutComponent } from './pages/about/about.component';
import { LocationComponent } from './pages/location/location.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'categories', component: CategoryComponent },
  { path: 'categories/:id', component: CategoryDetailComponent },
  { path: 'produit/:id', component: ProductDetailComponent },
  { path: 'a-propos', component: AboutComponent },
  { path: 'localisation', component: LocationComponent },
  { path: 'login', redirectTo: '' },
  { path: 'panier', redirectTo: '' },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
