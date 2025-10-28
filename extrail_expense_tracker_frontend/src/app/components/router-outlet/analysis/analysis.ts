import { Component, OnInit } from '@angular/core';
import { FilterBar } from './filter-bar/filter-bar';
import { BarChart } from './bar-chart/bar-chart';
import { CommonModule } from '@angular/common';
import { TransactionsModel } from '../../../models/transactions.model';
import { CategoriesModel } from '../../../models/categories.model';
import { TransactionsService } from '../../../services/transactions/transactions-service';
import { CategoriesService } from '../../../services/categories/categories-service';
import { Auth } from '../../../services/auth/auth';
import { FormsModule } from '@angular/forms';

interface CategorySpending {
  categoryName: string;
  amount: number;
  color: string;
}

interface DailySpending {
  day: number;
  amount: number;
}
@Component({
  selector: 'app-analysis',
  imports: [CommonModule, BarChart, FilterBar, FormsModule],
  templateUrl: './analysis.html',
  styleUrl: './analysis.css',
})
export class Analysis implements OnInit{
   transactions: TransactionsModel[] = [];
  categories: CategoriesModel[] = [];
  
  selectedMonth: string = '';
  availableMonths: { value: string; label: string }[] = [];
  
  categorySpendingData: CategorySpending[] = [];
  dailySpendingData: DailySpending[] = [];
  
  totalSpent: number = 0;
  averageDailySpending: number = 0;
  highestSpendingDay: number = 0;
  topCategory: string = '';
  
  isLoading = true;
  userId: number = 0;

  constructor(
    private transactionsService: TransactionsService,
    private categoriesService: CategoriesService,
    private authService: Auth
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user?.userId) {
      this.userId = user.userId;
      this.setDefaultMonth();
      this.loadData();
    }
  }

  setDefaultMonth(): void {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    this.selectedMonth = `${year}-${month}`;
    
    // Generate available months (last 12 months)
    this.availableMonths = [];
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      this.availableMonths.push({ value: yearMonth, label: monthName });
    }
  }

  loadData(): void {
    this.isLoading = true;
    
    this.transactionsService.getTransactionsByUser(this.userId).subscribe({
      next: (transactions) => {
        this.transactions = transactions;
        this.categoriesService.getAllCategories().subscribe({
          next: (categories) => {
            this.categories = categories;
            this.processData();
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Error loading categories:', err);
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        console.error('Error loading transactions:', err);
        this.isLoading = false;
      }
    });
  }

  onMonthChange(): void {
    this.processData();
  }

  processData(): void {
    // Filter transactions for selected month (expenses only)
    const monthTransactions = this.transactions.filter(tx => {
      const txDate = new Date(tx.date);
      const txMonth = `${txDate.getFullYear()}-${String(txDate.getMonth() + 1).padStart(2, '0')}`;
      return txMonth === this.selectedMonth && tx.transactionType === 'expense';
    });

    // Process category spending
    this.processCategorySpending(monthTransactions);
    
    // Process daily spending
    this.processDailySpending(monthTransactions);
    
    // Calculate statistics
    this.calculateStatistics(monthTransactions);
  }

  processCategorySpending(transactions: TransactionsModel[]): void {
    const categoryMap = new Map<number, number>();
    
    transactions.forEach(tx => {
      const current = categoryMap.get(tx.categoryId) || 0;
      categoryMap.set(tx.categoryId, current + tx.amount);
    });

    this.categorySpendingData = Array.from(categoryMap.entries())
      .map(([categoryId, amount]) => {
        const category = this.categories.find(c => c.categoryId === categoryId);
        return {
          categoryName: category?.categoryName || 'Unknown',
          amount: amount,
          color: this.getRandomColor()
        };
      })
      .sort((a, b) => b.amount - a.amount);
  }

  processDailySpending(transactions: TransactionsModel[]): void {
    const [year, month] = this.selectedMonth.split('-');
    const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();
    
    const dailyMap = new Map<number, number>();
    
    // Initialize all days with 0
    for (let day = 1; day <= daysInMonth; day++) {
      dailyMap.set(day, 0);
    }
    
    // Sum amounts per day
    transactions.forEach(tx => {
      const txDate = new Date(tx.date);
      const day = txDate.getDate();
      const current = dailyMap.get(day) || 0;
      dailyMap.set(day, current + tx.amount);
    });

    this.dailySpendingData = Array.from(dailyMap.entries())
      .map(([day, amount]) => ({ day, amount }))
      .sort((a, b) => a.day - b.day);
  }

  calculateStatistics(transactions: TransactionsModel[]): void {
    this.totalSpent = transactions.reduce((sum, tx) => sum + tx.amount, 0);
    
    const [year, month] = this.selectedMonth.split('-');
    const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();
    this.averageDailySpending = this.totalSpent / daysInMonth;
    
    const maxDaily = Math.max(...this.dailySpendingData.map(d => d.amount));
    const maxDayObj = this.dailySpendingData.find(d => d.amount === maxDaily);
    this.highestSpendingDay = maxDayObj?.day || 0;
    
    const topCat = this.categorySpendingData[0];
    this.topCategory = topCat?.categoryName || 'N/A';
  }

  getRandomColor(): string {
    const colors = [
      '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6',
      '#ec4899', '#14b8a6', '#f97316', '#06b6d4', '#a855f7'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  }
}
