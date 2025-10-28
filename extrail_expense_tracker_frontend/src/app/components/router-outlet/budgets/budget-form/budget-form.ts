import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BudgetsModel } from '../../../../models/budgets.model';
import { CategoriesModel } from '../../../../models/categories.model';
import { BudgetsService } from '../../../../services/budgets/budgets-service';

@Component({
  selector: 'app-budget-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './budget-form.html',
  styleUrl: './budget-form.css',
})
export class BudgetForm implements OnInit{
  @Input() userId!: number;
  @Input() budget: BudgetsModel | null = null;
  @Input() categories: CategoriesModel[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  budgetForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private budgetsService: BudgetsService
  ) {}

  ngOnInit(): void {
    this.budgetForm = this.fb.group({
      budgetName: [this.budget?.budgetName || '', [Validators.required, Validators.maxLength(120)]],
      categoryId: [this.budget?.categoryId || '', Validators.required],
      limitAmount: [this.budget?.limitAmount || 0, [Validators.required, Validators.min(0)]]
    });
  }

  get isEditing(): boolean {
    return this.budget !== null;
  }

  // src/app/components/budgets/budget-form/budget-form.ts

onSubmit(): void {
  if (this.budgetForm.invalid) {
    this.budgetForm.markAllAsTouched();
    return;
  }

  this.isSubmitting = true;
  this.errorMessage = '';

  const formValue = this.budgetForm.value;

  if (this.isEditing) {
    // Update existing budget - FIXED
    const updateData = {
      user: { userId: this.userId },  // ADD THIS
      budgetName: formValue.budgetName.trim(),
      limitAmount: Number(formValue.limitAmount),
      category: { categoryId: Number(formValue.categoryId) }
    };

    console.log('Updating budget with data:', updateData); // Debug log

    this.budgetsService.updateBudget(this.budget!.budgetId!, updateData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.saved.emit();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || 'Failed to update budget. Please try again.';
        console.error('Update budget error:', err);
        console.error('Error details:', err.error); // Additional debug
      }
    });
  } else {
    // Create new budget
    const budgetData = {
      user: { userId: this.userId },
      budgetName: formValue.budgetName.trim(),
      limitAmount: Number(formValue.limitAmount),
      category: { categoryId: Number(formValue.categoryId) }
    };

    console.log('Creating budget with data:', budgetData); // Debug log

    this.budgetsService.addBudget(budgetData as any).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.saved.emit();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || 'Failed to create budget. Please try again.';
        console.error('Create budget error:', err);
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
