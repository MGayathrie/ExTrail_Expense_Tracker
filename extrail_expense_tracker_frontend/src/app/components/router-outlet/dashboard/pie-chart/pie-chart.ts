import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ArcElement, Chart, ChartConfiguration, DoughnutController, Legend, registerables, Tooltip } from 'chart.js';

Chart.register(ArcElement, DoughnutController, Tooltip, Legend);
interface CategoryData {
  category: string;
  amount: number;
  color: string;
}
@Component({
  selector: 'app-pie-chart',
  imports: [CommonModule],
  templateUrl: './pie-chart.html',
  styleUrl: './pie-chart.css',
})
export class PieChart implements OnChanges, AfterViewInit, OnDestroy  {
  @Input() categoryData: CategoryData[] = [];
  @ViewChild('pieCanvas') pieCanvas!: ElementRef<HTMLCanvasElement>;
  
  private chart: Chart<'doughnut'> | null = null;

  ngAfterViewInit(): void {
    this.createChart();
  }

  ngOnChanges(): void {
    if (this.chart) {
      this.updateChart();
    }
  }

  private createChart(): void {
    if (!this.pieCanvas || this.categoryData.length === 0) return;

    const ctx = this.pieCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration<'doughnut'> = {
      type: 'doughnut',
      data: {
        labels: this.categoryData.map(cat => cat.category),
        datasets: [{
          data: this.categoryData.map(cat => cat.amount),
          backgroundColor: this.categoryData.map(cat => cat.color),
          borderWidth: 3,
          borderColor: '#ffffff',
          hoverOffset: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        layout: {
          padding: 10
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.parsed;
                const dataset = context.dataset.data as number[];
                const total = dataset.reduce((a: number, b: number) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `$${value.toLocaleString()} (${percentage}%)`;
              }
            }
          }
        }
      }
    };

    this.chart = new Chart(ctx, config);
  }

  private updateChart(): void {
    if (!this.chart) return;

    this.chart.data.labels = this.categoryData.map(cat => cat.category);
    this.chart.data.datasets[0].data = this.categoryData.map(cat => cat.amount);
    this.chart.data.datasets[0].backgroundColor = this.categoryData.map(cat => cat.color);
    this.chart.update();
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  }

  getPercentage(amount: number): string {
    const total = this.categoryData.reduce((sum, cat) => sum + cat.amount, 0);
    if (total === 0) return '0%';
    return `${((amount / total) * 100).toFixed(1)}%`;
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
