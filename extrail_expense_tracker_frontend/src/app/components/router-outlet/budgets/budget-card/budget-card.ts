import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BudgetsModel } from '../../../../models/budgets.model';
import { CommonModule } from '@angular/common';

interface BudgetWithSpending extends BudgetsModel {
  spentAmount: number;
  remainingAmount: number;
  percentageUsed: number;
  isExceeded: boolean;
}

@Component({
  selector: 'app-budget-card',
  imports: [CommonModule],
  templateUrl: './budget-card.html',
  styleUrl: './budget-card.css',
})
export class BudgetCard {
  @Input() budget!: BudgetWithSpending;
  @Output() edit = new EventEmitter<BudgetsModel>();
  @Output() delete = new EventEmitter<number>();

  // ADD THIS: Expose Math to template
  Math = Math;

  getCategoryIcon(categoryName: string): string {
    const icons: { [key: string]: string } = {
      'Food': '🍽️',
      'Transportation': '🚗',
      'Housing': '🏠',
      'Entertainment': '🎮',
      'Shopping': '🛍️',
      'Healthcare': '⚕️',
      'Education': '📚',
      'Utilities': '💡',
      'Groceries': '🛒'
    };
    return icons[categoryName] || '💰';
  }

  getProgressColor(): string {
    if (this.budget.isExceeded) return 'bg-red-500';
    if (this.budget.percentageUsed >= 80) return 'bg-yellow-500';
    return 'bg-pink-500';
  }

  getProgressBarBg(): string {
    if (this.budget.isExceeded) return 'bg-red-100';
    if (this.budget.percentageUsed >= 80) return 'bg-yellow-100';
    return 'bg-gray-200';
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  }

  onEdit(): void {
    this.edit.emit(this.budget);
  }

  onDelete(): void {
    this.delete.emit(this.budget.budgetId!);
  }
}
