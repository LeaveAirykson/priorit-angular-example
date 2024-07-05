import { Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { Book } from '../interfaces/book.interface';
import { BookFilter } from '../interfaces/bookfilter.interface';
import { SearchOrRule, SearchRule } from '../interfaces/searchrule.interface';
import { BookService } from '../services/book.service';
import { NotificationService } from '../services/notification.service';
import { filter2Rule, filterLabels, operatorMap } from '../utilities/book.helper';
import { Subject, takeUntil } from 'rxjs';

/**
 * This component lists all books found in storage.
 * Additionally offers some controls to search, filter and sort the data.
 */
@Component({
  selector: 'app-booklist',
  templateUrl: './booklist.component.html',
})
export class BooklistComponent implements OnDestroy {
  @ViewChild('searchfield') searchfield: ElementRef<HTMLInputElement>;
  @Input() overrides: { [key: string]: any };
  destroy$: Subject<boolean> = new Subject();
  data: Book[] = [];
  searched: boolean = false;
  searchterm: string | null = null;
  markedForRemoval: Book | null = null;
  editId: string;
  filterData: BookFilter | null = null;
  activeFilter: { label: string; value: string }[] = [];
  modalVisible: { [key: string]: boolean } = {
    filter: false,
    edit: false
  };

  constructor(
    private router: Router,
    private storage: BookService,
    private notification: NotificationService) {

    this.router.events.pipe(takeUntil(this.destroy$))
      .subscribe((e) => {
        if (e instanceof ActivationEnd) {
          if (e.snapshot.data['search']) {
            this.searchterm = e.snapshot.queryParams['term'];
          }

          if (e.snapshot.data['filter']) {
            this.setActiveFilter(e.snapshot.queryParams as BookFilter);
          }

          this.editId = e.snapshot.params['id'];
          this.showModal('edit', this.editId ? true : false);

          this.loadBooks();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  /**
   * Load books from storage
   *
   * @return {void}
   */
  loadBooks(): void {
    console.log('loadbooks');
    let payload: null | Array<SearchRule | SearchOrRule> = [];
    this.searched = this.searchterm || this.filterData ? true : false;

    if (this.searchterm) {
      payload = [{
        or: [{
          property: 'isbn',
          operator: 'regex',
          value: this.searchterm
        },
        {
          property: 'title',
          operator: 'regex',
          value: this.searchterm,
        }]
      }];
    }

    if (this.filterData && !this.searchterm) {
      payload = filter2Rule(this.filterData);
    }

    this.storage.get(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => this.data = result,
        error: (error) => console.error(error)
      });
  }

  /**
   * Triggers edit view for book with related id.
   *
   * @param  {string} id
   *
   * @return {void}
   */
  edit(id: string): void {
    this.router.navigate(['/edit', id]);
  }

  /**
   * Removes a book by its id from storage
   *
   * @param  {string} id
   *
   * @return {void}
   */
  remove(id: string): void {

    if (!this.markedForRemoval) {
      this.markedForRemoval = this.data.find((b) => b.id == id) ?? null;
      return;
    }

    this.storage.removeById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        if (response.success) {
          this.notification.success(response.message);
          this.data = this.data.filter((b) => b.id != id);
          this.markedForRemoval = null;
        } else {
          this.notification.error(response.message);
        }
      })
  }

  /**
   * Event handler for search input. Uses queryParams
   * to trigger search.
   *
   * @param  {Event} event
   *
   * @return {void}
   */
  updateSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.reset();

    if (!input.value) {
      return;
    }

    this.router.navigate(['/search'], { queryParams: { term: input.value } });
  }

  /**
   * Marks a book for removal
   *
   * @param  {Book} book
   *
   * @return {void}
   */
  markForRemoval(book: Book | null = null): void {
    this.markedForRemoval = book;
  }

  /**
   * Sets visibility of given modal id
   *
   * @param  {string} id id as defined in BooklistComponent#modalVisible
   * @param  {boolean} [show=true]
   *
   * @return {void}
   */
  showModal(id: string, show = true): void {
    this.modalVisible[id] = show;
  }

  /**
   * Sets the labels for active filters based ond passed
   * form values
   *
   * @param  {BookFilter} data
   *
   * @return {void}
   */
  updateFilter(data: BookFilter): void {
    this.router.navigate(['/filter'], { queryParams: data });
  }

  /**
   * Set readable filter information based on
   * passed book filter data.
   *
   * @param  {BookFilter} data
   *
   * @return {void}
   */
  setActiveFilter(data: BookFilter): void {
    const filter: { label: string; value: string }[] = [];
    this.filterData = Object.keys(data).length ? data : null;

    Object.keys(filterLabels).map((k) => {
      const value = String(data[k as keyof BookFilter]);

      // ignore empty ones
      if (['null', 'all', 'undefined'].includes(value)) { return; }

      // find related start - end fields and create
      // label based on these values and operator data
      const val = data[k + 'Start' as keyof BookFilter] ?? null;
      const val2 = data[k + 'End' as keyof BookFilter] ?? null;
      const lbl = [operatorMap[value]?.short ?? value, val, val2 ? '-' + val2 : ''];

      filter.push({
        label: filterLabels[k],
        value: lbl.join(' ')
      });

    });

    this.activeFilter = filter;
  }

  /**
   * Resets whole view with search, filtering, sorting
   * and reloads book list.
   */
  reset(): void {
    this.router.navigate(['/']);
  }
}
