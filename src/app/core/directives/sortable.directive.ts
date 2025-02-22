import { AfterContentInit, ContentChildren, Directive, EventEmitter, Input, OnDestroy, Output, QueryList } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { SortbyDirective } from './sortby.directive';
import { SortDirection } from '../models/sort-direction.type';
import { SortEvent } from '../models/sort-event.type';
import { O } from '../models/generics.interface';

/**
 * This directive is used to sort an array of data.
 * The triggers in form of SortbyDirectives need to exist inside
 * the content of the related element.
 * If this.sortable is passed, it will sort the array in place.
 */
@Directive({ selector: '[sortable]' })
export class SortableDirective implements AfterContentInit, OnDestroy {
  @Input() column: string;
  @Input() direction: SortDirection;
  @Input() sortable: O[] = [];
  @Output() sorted = new EventEmitter();
  @ContentChildren(SortbyDirective) sortByDirectives!: QueryList<SortbyDirective>;
  destroy$: Subject<boolean> = new Subject();

  ngAfterContentInit(): void {
    this.sort();

    this.sortByDirectives.toArray().map((directive) => {
      directive.sort.pipe(takeUntil(this.destroy$))
        .subscribe((s: SortEvent) => {
          this.column = s.column;
          this.direction = s.direction;
          this.sort();
        });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  sort() {
    if (this.sortable.length) {
      this.sortable.sort((a, b) => {
        if (this.direction == 'asc') {
          return a[this.column] < b[this.column] ? -1 : 1;
        }

        return a[this.column] < b[this.column] ? 1 : -1;
      });
    }

    this.sortByDirectives.toArray().map((directive) => {
      directive.active = directive.sortBy == this.column;
    });

    this.sorted.emit({ column: this.column, direction: this.direction });
  }

}
