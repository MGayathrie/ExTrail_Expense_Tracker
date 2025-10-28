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

interface DailySpending {
  day: number;
  amount: number;
}
@Component({
  selector: 'app-filter-bar',
  imports: [CommonModule],
  templateUrl: './filter-bar.html',
  styleUrl: './filter-bar.css',
})
export class FilterBar implements AfterViewInit, OnChanges {
  @Input() data: DailySpending[] = [];
  @ViewChild('lineChartCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

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
      type: 'line',
      data: {
        labels: this.data.map((d) => d.day.toString()),
        datasets: [
          {
            label: 'Daily Spending ($)',
            data: this.data.map((d) => d.amount),
            borderColor: '#8b5cf6',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: '#8b5cf6',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        // In filter-bar.component.ts - Replace the tooltip callbacks

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
              title: (items) => `Day ${items[0]?.label ?? ''}`, // FIX: Add optional chaining
              label: (context) => {
                const value = context.parsed.y ?? 0; // FIX: Add null coalescing
                return `Spent: $${value.toLocaleString()}`;
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
            title: {
              display: true,
              text: 'Day of Month',
              font: { size: 13, weight: 'bold' },
            },
            ticks: {
              font: { size: 11 },
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: 15,
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

    this.chart.data.labels = this.data.map((d) => d.day.toString());
    this.chart.data.datasets[0].data = this.data.map((d) => d.amount);
    this.chart.update();
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
