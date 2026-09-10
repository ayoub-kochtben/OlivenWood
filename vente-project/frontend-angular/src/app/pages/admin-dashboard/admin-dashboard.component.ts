import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { AdminService } from '../../core/services/admin.service';
import { AdminAuthService } from '../../core/services/admin-auth.service';
import { Router } from '@angular/router';
import { Product, ProductImage } from '../../core/models/product.model';
import { Category } from '../../core/models/category.model';
import { Commande } from '../../core/models/commande.model';
import { User } from '../../core/models/user.model';

type Onglet = 'produits' | 'categories' | 'commandes' | 'utilisateurs';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  ongletActif: Onglet = 'produits';

  produits: Product[] = [];
  categories: Category[] = [];
  produitEnEdition: Partial<Product> & { images?: ProductImage[] } = {};
  modeEditionProduit = false;

  categorieEnEdition: Partial<Category> = {};
  modeEditionCategorie = false;

  commandes: Commande[] = [];
  statutsDisponibles = ['EN_ATTENTE', 'VALIDEE', 'EXPEDIEE', 'LIVREE', 'ANNULEE'];

  utilisateurs: User[] = [];
  nouvelleImageUrl = '';

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private adminService: AdminService,
    private adminAuth: AdminAuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.chargerProduits();
    this.chargerCategories();
    this.chargerCommandes();
    this.chargerUtilisateurs();
  }

  changerOnglet(onglet: Onglet): void {
    this.ongletActif = onglet;
  }

  deconnecter(): void {
    this.adminAuth.logout();
    this.router.navigate(['/admin/login']);
  }

  // ---------- PRODUITS ----------
  chargerProduits(): void {
    this.productService.getAll().subscribe(res => this.produits = res);
  }

  nouveauProduit(): void {
    this.produitEnEdition = { images: [] };
    this.modeEditionProduit = true;
  }

  editerProduit(p: Product): void {
    this.produitEnEdition = { ...p, images: p.images ? [...p.images] : [] };
    this.modeEditionProduit = true;
  }

  annulerEditionProduit(): void {
    this.modeEditionProduit = false;
    this.produitEnEdition = {};
  }

  ajouterImage(): void {
    if (!this.nouvelleImageUrl.trim()) return;
    if (!this.produitEnEdition.images) this.produitEnEdition.images = [];
    this.produitEnEdition.images.push({ url: this.nouvelleImageUrl.trim() });
    this.nouvelleImageUrl = '';
  }

  retirerImage(index: number): void {
    this.produitEnEdition.images?.splice(index, 1);
  }

  enregistrerProduit(): void {
    const payload: any = {
      nom: this.produitEnEdition.nom,
      description: this.produitEnEdition.description,
      prix: this.produitEnEdition.prix,
      largeur: this.produitEnEdition.largeur,
      hauteur: this.produitEnEdition.hauteur,
      diametre: this.produitEnEdition.diametre,
      longueur: this.produitEnEdition.longueur,
      images: this.produitEnEdition.images,
      categorie: this.produitEnEdition.categorieId ? { id: this.produitEnEdition.categorieId } : null
    };

    if (this.produitEnEdition.id) {
      this.productService.update(this.produitEnEdition.id, payload).subscribe(() => {
        this.chargerProduits();
        this.annulerEditionProduit();
      });
    } else {
      this.productService.create(payload).subscribe(() => {
        this.chargerProduits();
        this.annulerEditionProduit();
      });
    }
  }

  supprimerProduit(id: number): void {
    if (!confirm('Supprimer ce produit ?')) return;
    this.productService.delete(id).subscribe(() => this.chargerProduits());
  }

  // ---------- CATEGORIES ----------
  chargerCategories(): void {
    this.categoryService.getAll().subscribe(res => this.categories = res);
  }

  nouvelleCategorie(): void {
    this.categorieEnEdition = {};
    this.modeEditionCategorie = true;
  }

  editerCategorie(c: Category): void {
    this.categorieEnEdition = { ...c };
    this.modeEditionCategorie = true;
  }

  annulerEditionCategorie(): void {
    this.modeEditionCategorie = false;
    this.categorieEnEdition = {};
  }

  enregistrerCategorie(): void {
    const payload = { nom: this.categorieEnEdition.nom };
    if (this.categorieEnEdition.id) {
      this.categoryService.update(this.categorieEnEdition.id, payload).subscribe(() => {
        this.chargerCategories();
        this.annulerEditionCategorie();
      });
    } else {
      this.categoryService.create(payload).subscribe(() => {
        this.chargerCategories();
        this.annulerEditionCategorie();
      });
    }
  }

  supprimerCategorie(id: number): void {
    if (!confirm('Supprimer cette catégorie ? Les produits associés perdront leur catégorie.')) return;
    this.categoryService.delete(id).subscribe(() => this.chargerCategories());
  }

  // ---------- COMMANDES ----------
  chargerCommandes(): void {
    this.adminService.getCommandes().subscribe(res => this.commandes = res);
  }

  changerStatut(commande: Commande, statut: string): void {
    this.adminService.changerStatutCommande(commande.id, statut).subscribe(res => {
      commande.statut = res.statut;
    });
  }

  // ---------- UTILISATEURS ----------
  chargerUtilisateurs(): void {
    this.adminService.getUtilisateurs().subscribe(res => this.utilisateurs = res);
  }
}