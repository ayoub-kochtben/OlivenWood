import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import { Product } from '../../../core/models/product.model';
import { Category } from '../../../core/models/category.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  motCle = '';
  resultats: Product[] = [];
  nombreArticlesPanier = 0;

  categories: Category[] = [];
  productsByCategory: { [id: number]: Product[] } = {};
  hoveredCategoryId: number | null = null;
  hoveredLocation = false;
  hoveredAbout = false;

  lienGoogleMaps = 'https://www.google.com/maps?q=35.44533566310324,11.01669485091932';

  isHomePage = true;
  isScrolled = false;
  compactSearchOpen = false;

  accountMenuOuvert = false;

  langues = [
    { code: 'fr', label: 'FR', drapeau: '🇫🇷' },
    { code: 'en', label: 'EN', drapeau: '🇬🇧' },
    { code: 'es', label: 'ES', drapeau: '🇪🇸' },
    { code: 'it', label: 'IT', drapeau: '🇮🇹' },
    { code: 'de', label: 'DE', drapeau: '🇩🇪' }
  ];
  langueActuelle = 'fr';
  langueMenuOuvert = false;

  constructor(
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService,
    private cartService: CartService,
    public authService: AuthService,
    private translate: TranslateService
  ) {
    this.translate.addLangs(['fr', 'en', 'es', 'it', 'de']);
    const langueSauvegardee = localStorage.getItem('langue') || 'fr';
    this.langueActuelle = langueSauvegardee;
    this.translate.use(langueSauvegardee);

    this.isHomePage = this.router.url === '/';
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isHomePage = event.urlAfterRedirects === '/';
        this.isScrolled = window.scrollY > 40;
      }
    });
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 40;
    if (!this.isScrolled) {
      this.compactSearchOpen = false;
    }
  }

  ngOnInit(): void {
    this.cartService.items$.subscribe(() => {
      this.nombreArticlesPanier = this.cartService.getNombreArticles();
    });
    this.categoryService.getAll().subscribe(res => this.categories = res);
  }

  rechercher(): void {
    if (this.motCle.trim().length > 1) {
      this.productService.search(this.motCle).subscribe(res => this.resultats = res);
    } else {
      this.resultats = [];
    }
  }

  allerVersProduit(id: number): void {
    this.resultats = [];
    this.motCle = '';
    this.compactSearchOpen = false;
    this.router.navigate(['/produit', id]);
  }

  onCategoryEnter(categorie: Category): void {
    this.hoveredCategoryId = categorie.id;
    if (!this.productsByCategory[categorie.id]) {
      this.productService.getByCategorie(categorie.id).subscribe(res => {
        this.productsByCategory[categorie.id] = res.slice(0, 4);
      });
    }
  }

  onCategoryLeave(): void {
    this.hoveredCategoryId = null;
  }

  toggleCompactSearch(): void {
    this.compactSearchOpen = !this.compactSearchOpen;
  }

  changerLangue(code: string): void {
    this.langueActuelle = code;
    this.translate.use(code);
    localStorage.setItem('langue', code);
    this.langueMenuOuvert = false;
  }

  toggleLangueMenu(): void {
    this.langueMenuOuvert = !this.langueMenuOuvert;
  }

  toggleAccountMenu(): void {
    this.accountMenuOuvert = !this.accountMenuOuvert;
  }

  deconnexion(): void {
    this.authService.logout();
    this.accountMenuOuvert = false;
    this.router.navigate(['/']);
  }
}