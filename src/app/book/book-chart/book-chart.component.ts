import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { BookModChart } from '../models/book-mod-chart.class';
import { Book } from '../models/book.class';

/**
 * Wrapper component for showing data chart. It includes a simple
 * control element to change its primary data dimension.
 */
@Component({
  selector: 'app-book-chart',
  templateUrl: './book-chart.component.html'
})
export class BookChartComponent implements OnInit, OnChanges, OnDestroy {
  @Input() data: Book[] = [];
  @Input() chartVisible = false;
  destroy$: Subject<boolean> = new Subject();
  chart = new BookModChart();
  dimensionField = new FormControl('year', { nonNullable: true });

  constructor(private router: Router, private route: ActivatedRoute) {
    // triggers repaint of chart by changing
    // dimension query param when select changes
    this.dimensionField.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => this.triggerChangeDimension(value));
  }

  ngOnInit(): void {
    // repaint chart on dimension param changes
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        if (params['dimension']) {
          this.changeDimension(params['dimension']);
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // repaint chart on input data changes
    if (changes['data']?.currentValue) {
      this.updateChart();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  /**
   * Updates/repaints chart
   *
   * @return {void}
   */
  updateChart(): void {
    this.chart = (new BookModChart()).parse(this.data, { ...this.chart.opts });
  }

  /**
   * Triggers dimension change and chart repaint
   * by changing route
   *
   * @param  {string} dimension
   *
   * @return {void}
   */
  triggerChangeDimension(dimension: string) {
    this.router.navigate([], {
      queryParams: { dimension: dimension, chart: true },
      queryParamsHandling: 'merge'
    })
  }

  /**
   * Changes dimension and triggers repaint of chart.
   *
   * @param  {string} dimension
   *
   * @return {void}
   */
  changeDimension(dimension: string): void {
    this.dimensionField.patchValue(dimension, { emitEvent: false });
    this.chart.opts['dimension'] = dimension;
    this.updateChart();
  }
}
