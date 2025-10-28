import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DashboardData } from '../dashboard';

@Component({
  selector: 'app-summary-cards',
  imports: [CommonModule],
  templateUrl: './summary-cards.html',
  styleUrl: './summary-cards.css',
})
export class SummaryCards {
  @Input() data!: DashboardData;

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  }

  formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`;
  }
}
