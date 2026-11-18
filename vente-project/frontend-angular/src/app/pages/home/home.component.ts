import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CategoryService } from '../../core/services/category.service';
import { ProductService } from '../../core/services/product.service';
import { Category } from '../../core/models/category.model';
import { Product } from '../../core/models/product.model';

interface StorySlide {
  image: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('carouselTrack') carouselTrack!: ElementRef<HTMLDivElement>;

  categories: Category[] = [];
  categoriesCarrousel: Category[] = [];
  produitsPopulaires: Product[] = [];
  produitsCarrousel: Product[] = [];

  storySlides: StorySlide[] = [
    { image: 'assets/images/history1.png' },
    { image: 'assets/images/history2.png' },
    { image: 'assets/images/history3.png' }
  ];
  currentSlide = 0;
  private autoplayId: any;

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.categories = this.categoryService.getAll();
    this.categoriesCarrousel = [...this.categories, ...this.categories];
    this.produitsCarrousel = this.productService.getAll();

    this.startAutoplay();
  }

  ngOnDestroy(): void {
    clearInterval(this.autoplayId);
  }

  startAutoplay(): void {
    this.autoplayId = setInterval(() => this.nextSlide(), 6000);
  }

  resetAutoplay(): void {
    clearInterval(this.autoplayId);
    this.startAutoplay();
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.storySlides.length;
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.storySlides.length) % this.storySlides.length;
  }

  goToSlide(i: number): void {
    this.currentSlide = i;
    this.resetAutoplay();
  }

  onArrowClick(direction: 'prev' | 'next'): void {
    direction === 'next' ? this.nextSlide() : this.prevSlide();
    this.resetAutoplay();
  }

  scrollCarousel(direction: 'prev' | 'next'): void {
    const track = this.carouselTrack.nativeElement;
    const scrollAmount = 280;
    track.scrollBy({
      left: direction === 'next' ? scrollAmount : -scrollAmount,
      behavior: 'smooth'
    });
  }

  trackByIndex(index: number): number {
    return index;
  }
} 