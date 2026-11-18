import { Injectable } from '@angular/core';
import { CATEGORIES } from '../data/site-data';
import { Category } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {

  getAll(): Category[] {
    return CATEGORIES;
  }

  getById(id: number): Category | undefined {
    return CATEGORIES.find(c => c.id === id);
  }
}
