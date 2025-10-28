import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriesModel, CategoryType } from '../../../../models/categories.model';
import { CategoriesService } from '../../../../services/categories/categories-service';

@Component({
  selector: 'app-category-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category-form.html',
  styleUrl: './category-form.css',
})
export class CategoryForm implements OnInit{
  @Input() userId!: number;
  @Input() category: CategoriesModel | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  categoryForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  categoryTypes = [
    { value: CategoryType.income, label: 'Income', icon: '💰', color: 'green' },
    { value: CategoryType.expense, label: 'Expense', icon: '💸', color: 'red' }
  ];

  constructor(
    private fb: FormBuilder,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      categoryName: [this.category?.categoryName || '', [Validators.required, Validators.maxLength(100)]],
      description: [this.category?.description || '', Validators.maxLength(100)],
      categoryType: [this.category?.categoryType || '', Validators.required]
    });
  }

  get isEditing(): boolean {
    return this.category !== null;
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const formValue = this.categoryForm.value;

    if (this.isEditing) {
      // Update existing category
      const updateData = {
        categoryName: formValue.categoryName.trim(),
        description: formValue.description?.trim() || null,
        categoryType: formValue.categoryType
      };

      this.categoriesService.updateCategory(this.category!.categoryId!, updateData).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.saved.emit();
        },
        error: (err) => {
          this.isSubmitting = false;
          this.errorMessage = err.error?.message || 'Failed to update category. Please try again.';
          console.error('Update category error:', err);
        }
      });
    } else {
      // Create new user category
      const categoryData = {
        categoryName: formValue.categoryName.trim(),
        description: formValue.description?.trim() || null,
        categoryType: formValue.categoryType,
        ownerUserId: this.userId
      };

      this.categoriesService.createUserCategory(categoryData).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.saved.emit();
        },
        error: (err) => {
          this.isSubmitting = false;
          this.errorMessage = err.error?.message || 'Failed to create category. Please try again.';
          console.error('Create category error:', err);
        }
      });
    }
  }

  onClose(): void {
    this.close.emit();
  }

  onBackgroundClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}
