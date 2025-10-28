import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { Users } from '../../../services/users/users';
import { TransactionsService } from '../../../services/transactions/transactions-service';
import { BudgetsService } from '../../../services/budgets/budgets-service';
import { CategoriesService } from '../../../services/categories/categories-service';
import { forkJoin } from 'rxjs';

Chart.register(...registerables);
@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit{
 isLoading = true;
  
  stats = {
    totalUsers: 0,
    activeUsers: 0,
    deactivatedUsers: 0,
    totalTransactions: 0,
    totalIncome: 0,
    totalExpenses: 0,
    totalCategories: 0,
    globalCategories: 0,
    userCategories: 0,
    activeBudgets: 0
  };

  constructor(
    private usersService: Users,
    private transactionsService: TransactionsService,
    private categoriesService: CategoriesService,
    private budgetsService: BudgetsService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;

    forkJoin({
      users: this.usersService.getAllUsers(),
      transactions: this.transactionsService.getAllTransactions(),
      categories: this.categoriesService.getAllCategories(),
      budgets: this.budgetsService.getAllBudgets()
    }).subscribe({
      next: (data) => {
        // Calculate user stats
        this.stats.totalUsers = data.users.length;
        this.stats.activeUsers = data.users.filter(u => !u.deactivated).length;
        this.stats.deactivatedUsers = data.users.filter(u => u.deactivated).length;

        // Calculate transaction stats
        this.stats.totalTransactions = data.transactions.length;
        this.stats.totalIncome = data.transactions
          .filter(t => t.transactionType === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
        this.stats.totalExpenses = data.transactions
          .filter(t => t.transactionType === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);

        // Calculate category stats
        this.stats.totalCategories = data.categories.length;
        this.stats.globalCategories = data.categories.filter(c => c.scope === 'global').length;
        this.stats.userCategories = data.categories.filter(c => c.scope === 'user').length;

        // Calculate budget stats
        this.stats.activeBudgets = data.budgets.length;

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard data:', err);
        this.isLoading = false;
      }
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  }

  get netBalance(): number {
    return this.stats.totalIncome - this.stats.totalExpenses;
  }
}
