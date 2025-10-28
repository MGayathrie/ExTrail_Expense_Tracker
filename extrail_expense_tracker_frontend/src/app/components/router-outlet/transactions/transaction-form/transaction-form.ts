import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountsModel } from '../../../../models/accounts.model';
import { TransactionsModel, TxType } from '../../../../models/transactions.model';
import { CategoriesModel } from '../../../../models/categories.model';
import { TransactionsService } from '../../../../services/transactions/transactions-service';

@Component({
  selector: 'app-transaction-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './transaction-form.html',
  styleUrl: './transaction-form.css',
})
export class TransactionForm implements OnInit {
  @Input() type: 'income' | 'expense' | 'transfer' = 'income';
  @Input() transaction: TransactionsModel | null = null;
  @Input() accounts: AccountsModel[] = [];
  @Input() incomeCategories: CategoriesModel[] = [];
  @Input() expenseCategories: CategoriesModel[] = [];
  @Input() userId!: number;

  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  transactionForm!: FormGroup;
  transferForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private transactionsService: TransactionsService) {}

  ngOnInit(): void {
    if (this.type === 'transfer') {
      this.initTransferForm();
    } else {
      this.initTransactionForm();
    }
  }

  initTransactionForm(): void {
    this.transactionForm = this.fb.group({
      amount: [this.transaction?.amount || '', [Validators.required, Validators.min(0.01)]],
      date: [this.formatDateForInput(this.transaction?.date), Validators.required],
      accountId: [this.transaction?.accountId || '', Validators.required],
      categoryId: [this.transaction?.categoryId || '', Validators.required],
      description: [
        this.transaction?.description || '',
        [Validators.required, Validators.maxLength(255)],
      ],
    });
  }

  initTransferForm(): void {
    this.transferForm = this.fb.group({
      fromAccountId: ['', Validators.required],
      toAccountId: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      date: [this.formatDateForInput(new Date().toISOString()), Validators.required],
      note: ['', Validators.maxLength(255)],
    });
  }

  formatDateForInput(dateStr?: string): string {
    if (!dateStr) {
      return new Date().toISOString().slice(0, 16);
    }
    return new Date(dateStr).toISOString().slice(0, 16);
  }

  get modalTitle(): string {
    if (this.type === 'transfer') return 'Transfer Money';
    if (this.transaction) {
      return this.type === 'income' ? 'Edit Income' : 'Edit Expense';
    }
    return this.type === 'income' ? 'Add Income' : 'Add Expense';
  }

  get categories(): CategoriesModel[] {
    return this.type === 'income' ? this.incomeCategories : this.expenseCategories;
  }

  get modalColor(): string {
    if (this.type === 'transfer') return 'purple';
    return this.type === 'income' ? 'cyan' : 'rose';
  }

  onSubmit(): void {
    if (this.type === 'transfer') {
      this.handleTransfer();
    } else {
      this.handleTransaction();
    }
  }

  // transaction-form.component.ts - Replace handleTransaction method
// src/app/components/transactions/transaction-form/transaction-form.ts
handleTransaction(): void {
  if (this.transactionForm.invalid) {
    this.transactionForm.markAllAsTouched();
    return;
  }

  this.isSubmitting = true;
  this.errorMessage = '';

  const formValue = this.transactionForm.value;
  
  // Create request body matching backend expectations
  const transactionData = {
    user: { userId: this.userId },
    account: { accountId: Number(formValue.accountId) },
    category: { categoryId: Number(formValue.categoryId) },
    amount: Number(formValue.amount),
    transactionType: this.type === 'income' ? 'income' : 'expense',
    description: formValue.description,
    date: new Date(formValue.date).toISOString(),
    transferGroupId: null
  };

  console.log('Sending transaction data:', transactionData); // Debug log

  if (this.transaction?.transactionId) {
    // Update existing transaction
    this.transactionsService.updateTransaction(this.transaction.transactionId, transactionData as any).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.saved.emit();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || 'Failed to update transaction. Please try again.';
        console.error('Update error:', err);
      }
    });
  } else {
    // Create new transaction
    this.transactionsService.createTransaction(transactionData as any).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.saved.emit();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || 'Failed to create transaction. Please try again.';
        console.error('Create error:', err);
        console.error('Error details:', err.error);
      }
    });
  }
}



  handleTransfer(): void {
    if (this.transferForm.invalid) {
      this.transferForm.markAllAsTouched();
      return;
    }

    const formValue = this.transferForm.value;

    if (formValue.fromAccountId === formValue.toAccountId) {
      this.errorMessage = 'Cannot transfer to the same account.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    this.transactionsService
      .transfer(
        this.userId,
        formValue.fromAccountId,
        formValue.toAccountId,
        formValue.amount,
        new Date(formValue.date).toISOString(),
        formValue.note
      )
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.saved.emit();
        },
        error: (err) => {
          this.isSubmitting = false;
          this.errorMessage = 'Failed to transfer money. Please try again.';
          console.error('Transfer error:', err);
        },
      });
  }

  onClose(): void {
    this.close.emit();
  }

  onBackgroundClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  // transaction-form.component.ts - Add this method
  trackByCategory(index: number, category: CategoriesModel): number {
    return category.categoryId!;
  }
}
