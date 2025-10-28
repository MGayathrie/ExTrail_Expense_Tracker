import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, ViewChild } from '@angular/core';
import { BarController, BarElement, CategoryScale, Chart, ChartConfiguration, Legend, LinearScale, Tooltip } from 'chart.js';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);
interface MonthlyData {
  income: number;
  expenses: number;
  month: string;
}
@Component({
  selector: 'app-bar-chart',
  imports: [CommonModule],
  templateUrl: './bar-chart.html',
  styleUrl: './bar-chart.css',
})
export class BarChart implements OnChanges, AfterViewInit, OnDestroy{
  @Input() monthlyData!: MonthlyData;
  @ViewChild('barCanvas') barCanvas!: ElementRef<HTMLCanvasElement>;
  
  private chart: Chart<'bar'> | null = null;

  ngAfterViewInit(): void {
    this.createChart();
  }

  ngOnChanges(): void {
    if (this.chart) {
      this.updateChart();
    }
  }

  private createChart(): void {
    if (!this.barCanvas || !this.monthlyData) return;

    const ctx = this.barCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels: ['Income', 'Expenses'],
        datasets: [{
          label: 'Amount',
          data: [this.monthlyData.income, this.monthlyData.expenses],
          backgroundColor: ['#06b6d4', '#f43f5e'],
          borderRadius: 8,
          barThickness: 60
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.parsed.y ?? 0; // Add null coalescing
                return `$${value.toLocaleString()}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(tickValue) {
                if (typeof tickValue === 'number') {
                  return `$${tickValue.toLocaleString()}`;
                }
                return tickValue;
              }
            },
            grid: {
              color: '#f3f4f6'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    };

    this.chart = new Chart(ctx, config);
  }

  private updateChart(): void {
    if (!this.chart) return;

    this.chart.data.datasets[0].data = [this.monthlyData.income, this.monthlyData.expenses];
    this.chart.update();
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
