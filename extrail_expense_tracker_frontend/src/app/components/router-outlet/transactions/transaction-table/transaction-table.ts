import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TransactionsModel } from '../../../../models/transactions.model';

@Component({
  selector: 'app-transaction-table',
  imports: [CommonModule],
  templateUrl: './transaction-table.html',
  styleUrl: './transaction-table.css',
})
export class TransactionTable {
  @Input() transactions: TransactionsModel[] = [];
  @Input() isLoading = false;
  @Output() edit = new EventEmitter<TransactionsModel>();
  @Output() delete = new EventEmitter<number>();

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  onEdit(transaction: TransactionsModel): void {
    this.edit.emit(transaction);
  }

  onDelete(transactionId: number): void {
    this.delete.emit(transactionId);
  }
}
