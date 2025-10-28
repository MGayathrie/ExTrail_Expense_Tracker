import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AccountsModel } from '../../../../models/accounts.model';

@Component({
  selector: 'app-account-list',
  imports: [CommonModule],
  templateUrl: './account-list.html',
  styleUrl: './account-list.css',
})
export class AccountList {
   @Input() accounts: AccountsModel[] = [];
  @Input() accountsByType: any;
  @Output() delete = new EventEmitter<number>();

  getAccountTypeIcon(type: string): string {
    const icons: { [key: string]: string } = {
      bank: '🏦',
      card: '💳',
      cash: '💵'
    };
    return icons[type] || '📊';
  }

  getAccountTypeColor(type: string): string {
    const colors: { [key: string]: string } = {
      bank: 'blue',
      card: 'purple',
      cash: 'green'
    };
    return colors[type] || 'gray';
  }

  getAccountTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      bank: 'Bank Account',
      card: 'Card',
      cash: 'Cash'
    };
    return labels[type] || type;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  }

  onDelete(accountId: number): void {
    this.delete.emit(accountId);
  }

  isNegative(balance: number): boolean {
    return balance < 0;
  }
}
