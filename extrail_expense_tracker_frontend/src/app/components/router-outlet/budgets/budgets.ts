import { Component, OnInit } from '@angular/core';
import { BudgetsModel } from '../../../models/budgets.model';
import { BudgetForm } from './budget-form/budget-form';
import { BudgetCard } from './budget-card/budget-card';
import { CommonModule } from '@angular/common';
import { CategoriesModel, CategoryType } from '../../../models/categories.model';
import { BudgetsService } from '../../../services/budgets/budgets-service';
import { TransactionsService } from '../../../services/transactions/transactions-service';
import { Auth } from '../../../services/auth/auth';
import { CategoriesService } from '../../../services/categories/categories-service';
import { forkJoin } from 'rxjs';

interface BudgetWithSpending extends BudgetsModel {
  spentAmount: number;
  remainingAmount: number;
  percentageUsed: number;
  isExceeded: boolean;
}

@Component({
  selector: 'app-budgets',
  imports: [CommonModule, BudgetForm, BudgetCard],
  templateUrl: './budgets.html',
  styleUrl: './budgets.css',
})
export class Budgets implements OnInit{
  budgets: BudgetWithSpending[] = [];
  expenseCategories: CategoriesModel[] = [];
  showAddModal = false;
  editingBudget: BudgetsModel | null = null;
  isLoading = true;
  userId: number = 0;

  constructor(
    private budgetsService: BudgetsService,
    private transactionsService: TransactionsService,
    private categoriesService: CategoriesService,
    private authService: Auth
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user?.userId) {
      this.userId = user.userId;
      this.loadData();
    }
  }

  loadData(): void {
    this.isLoading = true;
    
    forkJoin({
      budgets: this.budgetsService.getBudgetsByUser(this.userId),
      categories: this.categoriesService.listForUser(this.userId, CategoryType.expense),
      transactions: this.transactionsService.getTransactionsByUser(this.userId)
    }).subscribe({
      next: (data) => {
        this.expenseCategories = data.categories;
        
        // Calculate spending for each budget
        this.budgets = data.budgets.map(budget => {
          const spentAmount = this.calculateSpentAmount(
            budget.categoryId!, 
            data.transactions
          );
          const remainingAmount = budget.limitAmount - spentAmount;
          const percentageUsed = budget.limitAmount > 0 
            ? Math.round((spentAmount / budget.limitAmount) * 100)
            : 0;
          
          return {
            ...budget,
            spentAmount,
            remainingAmount,
            percentageUsed,
            isExceeded: spentAmount > budget.limitAmount
          };
        });
        
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading budgets:', err);
        this.isLoading = false;
      }
    });
  }

  calculateSpentAmount(categoryId: number, transactions: any[]): number {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return transactions
      .filter(tx => {
        const txDate = new Date(tx.date);
        return (
          tx.categoryId === categoryId &&
          tx.transactionType === 'expense' &&
          txDate.getMonth() === currentMonth &&
          txDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, tx) => sum + tx.amount, 0);
  }

  openAddModal(): void {
    this.editingBudget = null;
    this.showAddModal = true;
  }

  openEditModal(budget: BudgetsModel): void {
    this.editingBudget = budget;
    this.showAddModal = true;
  }

  closeModal(): void {
    this.showAddModal = false;
    this.editingBudget = null;
  }

  onBudgetSaved(): void {
    this.showAddModal = false;
    this.editingBudget = null;
    this.loadData();
  }

  onBudgetDeleted(budgetId: number): void {
    if (confirm('Are you sure you want to delete this budget?')) {
      this.budgetsService.deleteBudget(this.userId, budgetId).subscribe({
        next: () => {
          this.loadData();
        },
        error: (err) => console.error('Error deleting budget:', err)
      });
    }
  }

  get totalBudget(): number {
    return this.budgets.reduce((sum, b) => sum + b.limitAmount, 0);
  }

  get totalSpent(): number {
    return this.budgets.reduce((sum, b) => sum + b.spentAmount, 0);
  }

  get overallPercentage(): number {
    return this.totalBudget > 0 
      ? Math.round((this.totalSpent / this.totalBudget) * 100)
      : 0;
  }
  // In budgets.component.ts - make sure loadData is being called

// onTransactionSaved(): void {
//   // This should trigger in your transaction component
//   this.loadData(); // Reload budgets to recalculate spending
// }

}
