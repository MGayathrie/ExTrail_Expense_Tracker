import { Component, OnInit } from '@angular/core';
import { CategoriesModel, CategoryScope, CategoryType } from '../../../models/categories.model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoriesService } from '../../../services/categories/categories-service';
import { Users } from '../../../services/users/users';
import { forkJoin } from 'rxjs';

interface CategoryWithOwner extends CategoriesModel {
  ownerUserName?: string;
}
@Component({
  selector: 'app-admin-categories',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-categories.html',
  styleUrl: './admin-categories.css',
})
export class AdminCategories implements OnInit{
   // REMOVE showAddModal, keep only these:
  isAddingNew = false;
  categories: CategoryWithOwner[] = [];
  filteredCategories: CategoryWithOwner[] = [];
  selectedCategory: CategoryWithOwner | null = null;
  showEditModal = false;
  categoryForm!: FormGroup;
  isLoading = true;
  isSubmitting = false;
  searchTerm = '';
  filterScope: 'all' | 'global' | 'user' = 'all';
  errorMessage = '';

  constructor(
    private categoriesService: CategoriesService,
    private usersService: Users,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();
  }

  initForm(): void {
    this.categoryForm = this.fb.group({
      categoryName: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.maxLength(100)],
      categoryType: ['', Validators.required]
    });
  }

  loadCategories(): void {
    this.isLoading = true;
    
    forkJoin({
      categories: this.categoriesService.getAllCategories(),
      users: this.usersService.getAllUsers()
    }).subscribe({
      next: (data) => {
        this.categories = data.categories.map(cat => {
          const owner = data.users.find(u => u.userId === cat.ownerUser);
          return {
            ...cat,
            ownerUserName: owner?.userName || 'N/A'
          };
        });
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.categories];

    if (this.filterScope === 'global') {
      filtered = filtered.filter(c => c.scope === CategoryScope.global);
    } else if (this.filterScope === 'user') {
      filtered = filtered.filter(c => c.scope === CategoryScope.user);
    }

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(c =>
        c.categoryName.toLowerCase().includes(term) ||
        c.description?.toLowerCase().includes(term) ||
        c.ownerUserName?.toLowerCase().includes(term)
      );
    }

    this.filteredCategories = filtered;
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  canEditCategory(category: CategoryWithOwner): boolean {
    return category.scope === CategoryScope.global;
  }

  openAddModal(): void {
    this.isAddingNew = true;
    this.selectedCategory = null;
    this.categoryForm.reset();
    this.showEditModal = true; // This opens the modal
  }

  editCategory(category: CategoryWithOwner): void {
    if (!this.canEditCategory(category)) return;
    
    this.isAddingNew = false;
    this.selectedCategory = category;
    this.categoryForm.patchValue({
      categoryName: category.categoryName,
      description: category.description || '',
      categoryType: category.categoryType
    });
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedCategory = null;
    this.isAddingNew = false;
    this.categoryForm.reset();
    this.errorMessage = '';
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const formValue = this.categoryForm.value;

    if (this.isAddingNew) {
      // CREATE NEW GLOBAL CATEGORY
      const newCategory = {
        categoryName: formValue.categoryName.trim(),
        description: formValue.description?.trim() || null,
        categoryType: formValue.categoryType
      };

      this.categoriesService.createGlobalCategory(newCategory).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.closeEditModal();
          this.loadCategories();
        },
        error: (err) => {
          this.isSubmitting = false;
          this.errorMessage = err.error?.message || 'Failed to create category. Please try again.';
          console.error('Create category error:', err);
        }
      });
    } else {
      // UPDATE EXISTING GLOBAL CATEGORY
      const updateData = {
        categoryName: formValue.categoryName.trim(),
        description: formValue.description?.trim() || null,
        categoryType: formValue.categoryType
      };

      this.categoriesService.updateCategory(this.selectedCategory!.categoryId!, updateData).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.closeEditModal();
          this.loadCategories();
        },
        error: (err) => {
          this.isSubmitting = false;
          this.errorMessage = err.error?.message || 'Failed to update category. Please try again.';
          console.error('Update category error:', err);
        }
      });
    }
  }

  deleteCategory(categoryId: number): void {
    if (confirm('Are you sure you want to delete this global category? This action cannot be undone.')) {
      this.categoriesService.deleteCategoryById(categoryId).subscribe({
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

  onBackgroundClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeEditModal();
    }
  }

  getCategoryTypeColor(type: CategoryType): string {
    return type === CategoryType.income ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
