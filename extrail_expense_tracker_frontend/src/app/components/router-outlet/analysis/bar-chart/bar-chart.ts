import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);
interface CategorySpending {
  categoryName: string;
  amount: number;
  color: string;
}
@Component({
  selector: 'app-bar-chart',
  imports: [CommonModule],
  templateUrl: './bar-chart.html',
  styleUrl: './bar-chart.css',
})
export class BarChart implements AfterViewInit, OnChanges {
  @Input() data: CategorySpending[] = [];
  @ViewChild('barChartCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private chart: Chart | null = null;

  ngAfterViewInit(): void {
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && !changes['data'].firstChange) {
      this.updateChart();
    }
  }

  createChart(): void {
    if (!this.canvasRef) return;

    const ctx = this.canvasRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: this.data.map((d) => d.categoryName),
        datasets: [
          {
            label: 'Amount Spent ($)',
            data: this.data.map((d) => d.amount),
            backgroundColor: this.data.map((d) => d.color),
            borderColor: this.data.map((d) => d.color),
            borderWidth: 1,
            borderRadius: 8,
            barThickness: 50,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        // In bar-chart.component.ts - Replace the tooltip callbacks

        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            titleFont: { size: 14, weight: 'bold' },
            bodyFont: { size: 13 },
            callbacks: {
              label: (context) => {
                const value = context.parsed.y ?? 0; // FIX: Add null coalescing
                return `$${value.toLocaleString()}`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => `$${value.toLocaleString()}`,
              font: { size: 12 },
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)',
            },
          },
          x: {
            ticks: {
              font: { size: 12 },
            },
            grid: {
              display: false,
            },
          },
        },
      },
    };

    this.chart = new Chart(ctx, config);
  }

  updateChart(): void {
    if (!this.chart) {
      this.createChart();
      return;
    }

    this.chart.data.labels = this.data.map((d) => d.categoryName);
    this.chart.data.datasets[0].data = this.data.map((d) => d.amount);
    this.chart.data.datasets[0].backgroundColor = this.data.map((d) => d.color);
    this.chart.data.datasets[0].borderColor = this.data.map((d) => d.color);
    this.chart.update();
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
