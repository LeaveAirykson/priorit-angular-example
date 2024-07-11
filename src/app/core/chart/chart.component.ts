import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ChartConfiguration, Chart, BarController, CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title, Colors } from 'chart.js';
Chart.register(BarController, LinearScale, CategoryScale, BarElement, Tooltip, Legend, Title, Colors);

/**
 * Wrapper component for chart.js
 */
@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html'
})
export class ChartComponent implements AfterViewInit, OnChanges {
  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;
  @Input() config: ChartConfiguration;
  @Input() height: string = '320px';
  chart: any;

  ngAfterViewInit(): void {
    this.draw();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.draw();
  }

  private draw() {
    if (!this.canvas?.nativeElement || !this.config) {
      return;
    }

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(this.canvas.nativeElement, this.config);
  }
}
