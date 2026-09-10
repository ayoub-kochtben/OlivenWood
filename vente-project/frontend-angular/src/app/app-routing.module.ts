import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLoginComponent } from './pages/admin-login/admin-login.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { AdminGuard } from './core/guards/admin.guard';

import { HomeComponent } from './pages/home/home.component';
import { CategoryComponent } from './pages/category/category.component';
import { CategoryDetailComponent } from './pages/category-detail/category-detail.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { AboutComponent } from './pages/about/about.component';
import { LocationComponent } from './pages/location/location.component';
import { LoginComponent } from './pages/login/login.component';
import { CartComponent } from './pages/cart/cart.component';

const routes: Routes = [

  { path: '', component: HomeComponent },

  { path: 'categories', component: CategoryComponent },

  { path: 'categories/:id', component: CategoryDetailComponent },

  { path: 'produit/:id', component: ProductDetailComponent },

  { path: 'a-propos', component: AboutComponent },

  { path: 'localisation', component: LocationComponent },

  { path: 'login', component: LoginComponent },

  { path: 'panier', component: CartComponent },
  { path: 'admin/login', component: AdminLoginComponent },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [AdminGuard] },
  { path: '**', redirectTo: '' }

];

@NgModule({

  imports: [
   RouterModule.forRoot(routes, {
  scrollPositionRestoration: 'top',
  anchorScrolling: 'enabled'
  })
  ],

  exports: [
    RouterModule
  ]

})
export class AppRoutingModule {}