import { Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { Subject, filter, takeUntil } from 'rxjs';
import { Book, BookData } from '../interfaces/book.interface';
import { BookFilter } from '../interfaces/bookfilter.interface';
import { SearchOrRule, SearchRule } from '../interfaces/searchrule.interface';
import { BookService } from '../services/book.service';
import { HistoryService } from '../services/history.service';
import { NotificationService } from '../services/notification.service';
import { SortEvent } from '../directives/sortby.directive';
import { filter2Rule, filterLabels, operatorMap } from '../utilities/book.helper';

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
  @ViewChild('titleheadcell') titleheadcell: ElementRef<HTMLElement>;
  @Input() overrides: { [key: string]: any };
  destroy$: Subject<boolean> = new Subject();
  data: Book[] = [];
  searched: boolean = false;
  searchterm: string | null = null;
  markedForRemoval: Book | null = null;
  editId: string;
  filterData: BookFilter | null = null;
  activeFilter: { label: string; value: string }[] = [];
  sort: SortEvent = {
    column: 'title',
    direction: 'asc'
  };
  modalVisible: { [key: string]: boolean } = {
    filter: false,
    edit: false
  };

  constructor(
    private router: Router,
    private storage: BookService,
    private notification: NotificationService,
    private history: HistoryService) {

    // react to query param changes and show/hide
    // related modals, elements, etc.
    this.router.events.pipe(takeUntil(this.destroy$))
      .pipe(filter((f): f is ActivationEnd => f instanceof ActivationEnd))
      .subscribe((e) => {
        // extract searchterm on /search route
        if (e.snapshot.routeConfig?.path == 'search') {
          this.searchterm = e.snapshot.queryParams['term'];
        }

        // extract and set active filters from queryParams on /filter route
        if (e.snapshot.routeConfig?.path == 'filter') {
          this.setActiveFilter(e.snapshot.queryParams as BookFilter);
        }

        // show edit modal for add/edit params
        if (e.snapshot.queryParams['add']) {
          this.showModal('edit', true);
        } else {
          this.editId = e.snapshot.queryParams['edit'];
          this.showModal('edit', this.editId ? true : false);
        }

        this.loadBooks();
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
    let payload: null | Array<SearchRule | SearchOrRule> = [];
    this.searched = this.searchterm || this.filterData ? true : false;

    // create search payload
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

    // use current filters if set and
    // no search has been requested
    if (this.filterData && !this.searchterm) {
      payload = filter2Rule(this.filterData);
    }

    this.storage.get(payload, this.sort)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => this.data = result,
        error: (error) => console.error(error)
      });
  }

  /**
   * Triggers showing add/edit form in 'add' mode
   *
   * @param  {boolean} [show=true]
   *
   * @return {void}
   */
  showAddForm(show: boolean = true): void {
    this.showModal('edit', show);
    if (show) {
      this.history.setParam('add', 'true');
    } else {
      this.history.removeParam(['edit', 'add']);
    }
  }

  /**
   * Removes a book by its id from storage
   *
   * @param  {string} id
   *
   * @return {void}
   */
  removeBook(id: string): void {
    // mark book to be removed, forces
    // modal to open and user needs to confirm deletion
    if (!this.markedForRemoval || this.markedForRemoval?.id !== id) {
      this.markForRemoval(this.data.find((b) => b.id == id));
      return;
    }

    // reset marked book
    this.markForRemoval();

    // run deletion
    this.storage.removeById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.notification.success(response.message);
          this.data = this.data.filter((b) => b.id != id);
        },
        error: (error) => this.notification.error(error)
      });
  }

  /**
   * Saves a book to storage
   *
   * @param  {BookData} data
   *
   * @return {void}
   */
  saveBook(data: Partial<BookData>): void {
    // if in edit mode update the current book
    // and hide add/edit form afterwards
    if (this.editId) {
      this.storage.update(this.editId, data)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.notification.success(response.message);
            this.loadBooks();
            this.showAddForm(false);
          },
          error: (err) => this.notification.error(err)
        });
      return;
    }

    // otherwise create a new book
    this.storage.create(data as BookData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.notification.success(response.message);
          this.loadBooks();
        },
        error: (err) => this.notification.error(err)
      });
  }

  /**
   * Triggers showing add/edit form for book with related id.
   *
   * @param  {string} id
   *
   * @return {void}
   */
  editBook(id: string): void {
    this.editId = id;
    this.showModal('edit', true);
    this.history.setParam('edit', id);
  }

  /**
   * Event handler for search input. Uses queryParams
   * to trigger search.
   *
   * @param  {Event} event
   *
   * @return {void}
   */
  runSearch(event: Event): void {
    const input = event.target as HTMLInputElement;

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
  runFilter(data: BookFilter): void {
    this.router.navigate(['/filter'], { queryParams: data });
    this.showModal('filter', false);
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

    // save current filter data values
    // needed to populate filter form on opening
    this.filterData = Object.keys(data).length ? data : null;

    // create string representations of active filters
    Object.keys(filterLabels).map((k) => {
      const value = String(data[k as keyof BookFilter]);

      // ignore empty ones
      if (['null', 'all', 'undefined'].includes(value)) { return; }

      // find related start - end fields and create
      // label based on these values and operator data
      const val = data[k + 'Start' as keyof BookFilter] ?? null;
      const val2 = data[k + 'End' as keyof BookFilter] ?? null;
      const lbl = [operatorMap[value]?.short ?? value, val];

      if (value == 'range' && val2) {
        lbl.push('- ' + val2)
      }

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
