import { Directive, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';
import { SortDirection } from '../models/sort-direction.type';
import { SortDirectionMap } from '../models/sort-direction-map.type';

const directions: SortDirectionMap = { desc: 'asc', asc: 'desc' };

/**
 * Child directive used in correlation with SortableDirective.
 */
@Directive({
  selector: '[sortBy]'
})
export class SortbyDirective {
  @Input() sortBy: string;
  @Input() sortDirection: SortDirection = 'asc';
  @Output() sort = new EventEmitter();
  @HostBinding('class.sorted') isActive = false;
  @HostBinding('class.desc') isDesc = false;

  @Input() set active(active: boolean) {
    this.isActive = active;
    this.isDesc = this.sortDirection == 'desc';
  };

  @HostListener('click') onClick() {
    this.sortDirection = directions[this.sortDirection];
    this.isDesc = this.sortDirection == 'desc';
    this.sort.emit({ column: this.sortBy, direction: this.sortDirection });
  }

  get active() {
    return this.isActive;
  }

}
