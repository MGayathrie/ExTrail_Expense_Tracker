import { Component, OnInit } from '@angular/core';
import { CategoryList } from './category-list/category-list';
import { CategoryForm } from './category-form/category-form';
import { CommonModule } from '@angular/common';
import { CategoriesModel, CategoryScope } from '../../../models/categories.model';
import { CategoriesService } from '../../../services/categories/categories-service';
import { Auth } from '../../../services/auth/auth';

@Component({
  selector: 'app-categories',
  imports: [CommonModule, CategoryForm, CategoryList],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories implements OnInit{
  allCategories: CategoriesModel[] = [];
  filteredCategories: CategoriesModel[] = [];
  showAddModal = false;
  editingCategory: CategoriesModel | null = null;
  isLoading = true;
  userId: number = 0;
  
  selectedFilter: 'all' | 'my' = 'all';

  constructor(
    private categoriesService: CategoriesService,
    private authService: Auth
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user?.userId) {
      this.userId = user.userId;
      this.loadCategories();
    }
  }

  loadCategories(): void {
    this.isLoading = true;
    this.categoriesService.getAllCategories().subscribe({
      next: (categories) => {
        this.allCategories = categories;
        this.applyFilter();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        this.isLoading = false;
      }
    });
  }

  applyFilter(): void {
    if (this.selectedFilter === 'all') {
      // Show all categories (global + user's own categories)
      this.filteredCategories = this.allCategories.filter(cat => 
        cat.scope === CategoryScope.global || cat.ownerUser === this.userId
      );
    } else {
      // Show only user's categories
      this.filteredCategories = this.allCategories.filter(cat => 
        cat.scope === CategoryScope.user && cat.ownerUser === this.userId
      );
    }
  }

  onFilterChange(filter: 'all' | 'my'): void {
    this.selectedFilter = filter;
    this.applyFilter();
  }

  openAddModal(): void {
    this.editingCategory = null;
    this.showAddModal = true;
  }

  openEditModal(category: CategoriesModel): void {
    this.editingCategory = category;
    this.showAddModal = true;
  }

  closeModal(): void {
    this.showAddModal = false;
    this.editingCategory = null;
  }

  onCategorySaved(): void {
    this.showAddModal = false;
    this.editingCategory = null;
    this.loadCategories();
  }

  onCategoryDeleted(categoryId: number): void {
    if (confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      this.categoriesService.deleteCategory(this.userId, categoryId).subscribe({
        next: () => {
          this.loadCategories();
        },
        error: (err) => {
          console.error('Error deleting category:', err);
          alert('Failed to delete category. It may be in use by transactions or budgets.');
        }
      });
    }
  }

  get globalCount(): number {
    return this.allCategories.filter(c => c.scope === CategoryScope.global).length;
  }

  get userCount(): number {
    return this.allCategories.filter(c => c.scope === CategoryScope.user && c.ownerUser === this.userId).length;
  }

  
}
