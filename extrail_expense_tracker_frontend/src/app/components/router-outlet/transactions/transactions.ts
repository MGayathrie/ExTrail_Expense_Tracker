import { Component, OnInit } from '@angular/core';
import { TransactionsModel, TxType } from '../../../models/transactions.model';
import { AccountsModel } from '../../../models/accounts.model';
import { CategoriesModel, CategoryType } from '../../../models/categories.model';
import { AccountsService } from '../../../services/accounts/accounts-service';
import { CategoriesService } from '../../../services/categories/categories-service';
import { Auth } from '../../../services/auth/auth';
import { forkJoin } from 'rxjs';
import { TransactionForm } from './transaction-form/transaction-form';
import { TransactionTable } from './transaction-table/transaction-table';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TransactionsService } from '../../../services/transactions/transactions-service';

@Component({
  selector: 'app-transactions',
  imports: [CommonModule, FormsModule, TransactionTable, TransactionForm],
  templateUrl: './transactions.html',
  styleUrl: './transactions.css',
})
export class Transactions implements OnInit{
  transactions: TransactionsModel[] = [];
  filteredTransactions: TransactionsModel[] = [];
  accounts: AccountsModel[] = [];
  incomeCategories: CategoriesModel[] = [];
  expenseCategories: CategoriesModel[] = [];
  
  selectedType: string = 'all';
  selectedCategory: number = 0;
  selectedMonth: string = 'all';
  
  showModal = false;
  modalType: 'income' | 'expense' | 'transfer' = 'income';
  editingTransaction: TransactionsModel | null = null;
  
  isLoading = true;
  userId: number = 0;

  months = [
    { value: 'all', label: 'All Months' },
    { value: '2025-01', label: 'January 2025' },
    { value: '2025-02', label: 'February 2025' },
    { value: '2025-03', label: 'March 2025' },
    { value: '2025-04', label: 'April 2025' },
    { value: '2025-05', label: 'May 2025' },
    { value: '2025-06', label: 'June 2025' },
    { value: '2025-07', label: 'July 2025' },
    { value: '2025-08', label: 'August 2025' },
    { value: '2025-09', label: 'September 2025' },
    { value: '2025-10', label: 'October 2025' },
    { value: '2025-11', label: 'November 2025' },
    { value: '2025-12', label: 'December 2025' }
  ];

  constructor(
    private transactionsService: TransactionsService,
    private accountsService: AccountsService,
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
      transactions: this.transactionsService.getTransactionsByUser(this.userId),
      accounts: this.accountsService.getAccountsByUser(this.userId),
      incomeCategories: this.categoriesService.listForUser(this.userId, CategoryType.income),
      expenseCategories: this.categoriesService.listForUser(this.userId, CategoryType.expense)
    }).subscribe({
      next: (data) => {
        this.transactions = data.transactions;
        this.accounts = data.accounts.filter(acc => !acc.archived);
        
        // Remove duplicates using Map (most reliable method)
        this.incomeCategories = this.removeDuplicates(data.incomeCategories);
        this.expenseCategories = this.removeDuplicates(data.expenseCategories);
        
        console.log('Categories loaded:');
        console.log('- Income:', this.incomeCategories.length, this.incomeCategories);
        console.log('- Expense:', this.expenseCategories.length, this.expenseCategories);
        
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading transactions:', err);
        this.isLoading = false;
      }
    });
  }

  // Robust deduplication method
  private removeDuplicates(categories: CategoriesModel[]): CategoriesModel[] {
    const seen = new Map<number, CategoriesModel>();
    categories.forEach(cat => {
      if (cat.categoryId !== undefined && cat.categoryId !== null && !seen.has(cat.categoryId)) {
        seen.set(cat.categoryId, cat);
      }
    });
    return Array.from(seen.values());
  }

  
  applyFilters(): void {
    this.filteredTransactions = this.transactions.filter(tx => {
      // Type filter
      if (this.selectedType !== 'all' && tx.transactionType !== this.selectedType) {
        return false;
      }
      
      // Category filter
      if (this.selectedCategory !== 0) {
        if (Number(tx.categoryId) !== Number(this.selectedCategory)) {
          return false;
        }
      }
      
      // Month filter
      if (this.selectedMonth !== 'all') {
        const txMonth = tx.date.substring(0, 7);
        if (txMonth !== this.selectedMonth) {
          return false;
        }
      }
      
      return true;
    });
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  openIncomeForm(): void {
    this.modalType = 'income';
    this.editingTransaction = null;
    this.showModal = true;
  }

  openExpenseForm(): void {
    this.modalType = 'expense';
    this.editingTransaction = null;
    this.showModal = true;
  }

  openTransferForm(): void {
    this.modalType = 'transfer';
    this.editingTransaction = null;
    this.showModal = true;
  }

  onEdit(transaction: TransactionsModel): void {
    this.editingTransaction = transaction;
    this.modalType = transaction.transactionType === TxType.income ? 'income' : 'expense';
    this.showModal = true;
  }

  onDelete(transactionId: number): void {
    if (confirm('Are you sure you want to delete this transaction?')) {
      this.transactionsService.deleteTransaction(this.userId, transactionId).subscribe({
        next: () => {
          this.loadData();
        },
        error: (err) => console.error('Error deleting transaction:', err)
      });
    }
  }

  onModalClose(): void {
    this.showModal = false;
    this.editingTransaction = null;
  }

  onTransactionSaved(): void {
    this.showModal = false;
    this.editingTransaction = null;
    this.loadData();
  }

  trackByCategory(index: number, category: CategoriesModel): number | undefined {
    return category.categoryId;
  }

  get allCategories(): CategoriesModel[] {
    const combined = [...this.incomeCategories, ...this.expenseCategories];
    return this.removeDuplicates(combined);
  }
}
