import { Directive, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';

export type SortDirection = 'asc' | 'desc';
export type SortEvent = { column: string; direction: SortDirection };

const directions: { [key in SortDirection]: SortDirection } = { desc: 'asc', asc: 'desc' };

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
