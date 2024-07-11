import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivationEnd, Router } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';
import { BookModChart } from '../models/book-mod-chart.class';
import { Book } from '../models/book.class';

@Component({
  selector: 'app-book-chart',
  templateUrl: './book-chart.component.html',
  styleUrls: ['./book-chart.component.css']
})
export class BookChartComponent implements OnChanges, OnDestroy {
  @Input() data: Book[] = [];
  @Input() chartVisible = false;
  destroy$: Subject<boolean> = new Subject();
  chart = new BookModChart();
  dimensionField = new FormControl('year', { nonNullable: true });

  constructor(private router: Router) {

    console.log('book-chart: constructed');

    // change route dimension param on
    // select box change
    this.dimensionField.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.router.navigate([], {
          queryParams: { dimension: value, chart: true },
          queryParamsHandling: 'merge'
        })
      });

    // react to router param changes
    this.router.events.pipe(takeUntil(this.destroy$))
      .pipe(filter((f): f is ActivationEnd => f instanceof ActivationEnd))
      .subscribe((e) => {
        console.log('book-chart: navigated');

        const params = e.snapshot.queryParams;

        // trigger repaint of chart
        // and use dimension param in select box
        if (params['dimension']) {
          this.dimensionField.patchValue(params['dimension'], { emitEvent: false });
          this.chart.opts['dimension'] = params['dimension'];
          this.updateChart();
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // repaint chart when data has changed
    if (changes['data']?.currentValue) {
      this.updateChart();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  updateChart() {
    this.chart = (new BookModChart()).parse(this.data, { ...this.chart.opts });
  }
}
