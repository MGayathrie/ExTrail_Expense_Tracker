import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountsModel, AccountType } from '../../../../models/accounts.model';
import { AccountsService } from '../../../../services/accounts/accounts-service';

@Component({
  selector: 'app-account-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './account-form.html',
  styleUrl: './account-form.css',
})
export class AccountForm {
  @Input() userId!: number;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  accountForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  accountTypes = [
    { value: AccountType.bank, label: 'Bank Account', icon: '🏦', color: 'blue' },
    { value: AccountType.card, label: 'Credit/Debit Card', icon: '💳', color: 'purple' },
    { value: AccountType.cash, label: 'Cash', icon: '💵', color: 'green' }
  ];

  constructor(
    private fb: FormBuilder,
    private accountsService: AccountsService
  ) {}

  ngOnInit(): void {
    this.accountForm = this.fb.group({
      accountType: ['', Validators.required],
      accountName: ['', [Validators.required, Validators.maxLength(100)]],
      accountBalance: [0, [Validators.required, Validators.min(0)]]
    });
  }

  onSubmit(): void {
    if (this.accountForm.invalid) {
      this.accountForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const formValue = this.accountForm.value;

    // Match backend expectations (nested user object)
    const accountData = {
      user: { userId: this.userId },
      accountType: formValue.accountType,
      accountName: formValue.accountName.trim(),
      accountBalance: Number(formValue.accountBalance),
      archived: false
    };

    console.log('Creating account with data:', accountData);

    this.accountsService.createAccount(accountData as any).subscribe({
      next: (response) => {
        console.log('Account created successfully:', response);
        this.isSubmitting = false;
        this.saved.emit();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || 'Failed to create account. Please try again.';
        console.error('Create account error:', err);
      }
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
}
