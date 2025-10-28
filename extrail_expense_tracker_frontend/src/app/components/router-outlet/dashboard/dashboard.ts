import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SummaryCards } from './summary-cards/summary-cards';
import { PieChart } from './pie-chart/pie-chart';
import { BarChart } from './bar-chart/bar-chart';
import { AccountsService } from '../../../services/accounts/accounts-service';
import { CategoriesService } from '../../../services/categories/categories-service';
import { Auth } from '../../../services/auth/auth';
import { forkJoin } from 'rxjs';
import { CategoriesModel, CategoryType } from '../../../models/categories.model';
import { AccountsModel } from '../../../models/accounts.model';
import { TransactionsModel, TxType } from '../../../models/transactions.model';
import { TransactionsService } from '../../../services/transactions/transactions-service';

export interface DashboardData {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsRate: number;
  categorySpending: { category: string; amount: number; color: string }[];
  monthlyOverview: { income: number; expenses: number; month: string };
}
@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, SummaryCards, PieChart, BarChart],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  dashboardData: DashboardData | null = null;
  isLoading = true;
  errorMessage = '';

  private readonly COLORS = [
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#f59e0b', // amber
    '#10b981', // emerald
    '#6366f1', // indigo
    '#8b5cf6', // violet
    '#f97316', // orange
    '#14b8a6'  // teal
  ];

  constructor(
    private accountsService: AccountsService,
    private transactionsService: TransactionsService,
    private categoriesService: CategoriesService,
    private authService: Auth
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    const user = this.authService.getUser();
    if (!user || !user.userId) {
      this.errorMessage = 'User not found. Please log in again.';
      this.isLoading = false;
      return;
    }

    const userId = user.userId;

    forkJoin({
      accounts: this.accountsService.getAccountsByUser(userId),
      transactions: this.transactionsService.getTransactionsByUser(userId),
      expenseCategories: this.categoriesService.listForUser(userId, CategoryType.expense)
    }).subscribe({
      next: (data) => {
        this.dashboardData = this.processData(data.accounts, data.transactions, data.expenseCategories);
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load dashboard data.';
        this.isLoading = false;
        console.error('Dashboard error:', err);
      }
    });
  }

  private processData(
    accounts: AccountsModel[],
    transactions: TransactionsModel[],
    categories: CategoriesModel[]
  ): DashboardData {
    // Filter out archived accounts
    const activeAccounts = accounts.filter(acc => !acc.archived);

    // Calculate total balance
    const totalBalance = activeAccounts.reduce((sum, acc) => sum + acc.accountBalance, 0);

    // Get current month transactions
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const currentMonthTxs = transactions.filter(tx => {
      const txDate = new Date(tx.date);
      return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
    });

    // Calculate monthly income and expenses
    const monthlyIncome = currentMonthTxs
      .filter(tx => tx.transactionType === TxType.income)
      .reduce((sum, tx) => sum + tx.amount, 0);

    const monthlyExpenses = currentMonthTxs
      .filter(tx => tx.transactionType === TxType.expense)
      .reduce((sum, tx) => sum + tx.amount, 0);

    // Calculate savings rate
    const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0;

    // Calculate spending by category
    const categoryMap = new Map<number, { name: string; amount: number }>();
    
    currentMonthTxs
      .filter(tx => tx.transactionType === TxType.expense)
      .forEach(tx => {
        const existing = categoryMap.get(tx.categoryId) || { name: tx.categoryName || 'Unknown', amount: 0 };
        existing.amount += tx.amount;
        categoryMap.set(tx.categoryId, existing);
      });

    const categorySpending = Array.from(categoryMap.values())
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 8) // Top 8 categories
      .map((cat, index) => ({
        category: cat.name,
        amount: cat.amount,
        color: this.COLORS[index % this.COLORS.length]
      }));

    // Monthly overview
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyOverview = {
      income: monthlyIncome,
      expenses: monthlyExpenses,
      month: `${monthNames[currentMonth]} ${currentYear}`
    };

    return {
      totalBalance,
      monthlyIncome,
      monthlyExpenses,
      savingsRate,
      categorySpending,
      monthlyOverview
    };
  }
}
