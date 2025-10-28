import { Component, OnInit } from '@angular/core';
import { AccountList } from './account-list/account-list';
import { AccountForm } from './account-form/account-form';
import { CommonModule } from '@angular/common';
import { AccountsModel } from '../../../models/accounts.model';
import { Auth } from '../../../services/auth/auth';
import { AccountsService } from '../../../services/accounts/accounts-service';

@Component({
  selector: 'app-accounts',
  imports: [CommonModule, AccountForm, AccountList],
  templateUrl: './accounts.html',
  styleUrl: './accounts.css',
})
export class Accounts implements OnInit{
  accounts: AccountsModel[] = [];
  showAddModal = false;
  isLoading = true;
  userId: number = 0;

  constructor(
    private accountsService: AccountsService,
    private authService: Auth
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user?.userId) {
      this.userId = user.userId;
      this.loadAccounts();
    }
  }

  loadAccounts(): void {
    this.isLoading = true;
    this.accountsService.getAccountsByUser(this.userId).subscribe({
      next: (accounts) => {
        // Only show non-archived accounts
        this.accounts = accounts.filter(acc => !acc.archived);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading accounts:', err);
        this.isLoading = false;
      }
    });
  }

  openAddModal(): void {
    this.showAddModal = true;
  }

  closeModal(): void {
    this.showAddModal = false;
  }

  onAccountAdded(): void {
    this.showAddModal = false;
    this.loadAccounts();
  }

  onAccountDeleted(accountId: number): void {
    if (confirm('Are you sure you want to delete this account? It will no longer appear in transaction forms.')) {
      this.accountsService.deleteAccount(this.userId, accountId).subscribe({
        next: () => {
          this.loadAccounts();
        },
        error: (err) => console.error('Error deleting account:', err)
      });
    }
  }

  get totalBalance(): number {
    return this.accounts.reduce((sum, acc) => sum + acc.accountBalance, 0);
  }

  get accountsByType() {
    return {
      bank: this.accounts.filter(acc => acc.accountType === 'bank'),
      card: this.accounts.filter(acc => acc.accountType === 'card'),
      cash: this.accounts.filter(acc => acc.accountType === 'cash')
    };
  }
}
