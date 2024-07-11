import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { SortEvent } from 'src/app/core/models/sort-event.type';
import { Obool } from '../../core/models/generics.interface';
import { HistoryService } from '../../core/services/history.service';
import { NotificationService } from '../../core/services/notification.service';
import { BookData } from '../models/book-data.type';
import { BookFilter } from '../models/book-filter.type';
import { Book } from '../models/book.class';
import { SearchOrRule } from '../models/search-or-rule.interface';
import { SearchRule } from '../models/search-rule.interface';
import { BookService } from '../services/book.service';
import { filterLabels, operatorMap } from '../utilities/book.helper';
import { createSearchRule } from '../utilities/create-search-rule.helper';

/**
 * This component lists all books found in storage.
 * Additionally offers some controls to search, filter and sort the data.
 */
@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
})
export class BookListComponent implements OnInit, OnDestroy {
  @ViewChild('searchfield') searchfield: ElementRef<HTMLInputElement>;
  destroy$: Subject<boolean> = new Subject();
  data: Book[] = [];
  modalVisible: Obool = { filter: false, edit: false };
  searched: boolean = false;
  searchterm: string | null = null;
  markedForRemoval: Book | null = null;
  editId: string;
  filterData: BookFilter | null = null;
  chartVisible: boolean = false;
  activeFilter: { label: string; value: string }[] = [];
  sort: SortEvent = { column: 'title', direction: 'asc' };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storage: BookService,
    private notification: NotificationService,
    private history: HistoryService) { }

  ngOnInit(): void {
    console.log('book-list: init');

    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        console.log('book-list: queryParams');
        this.searchterm = params['term'];
        this.chartVisible = params['chart'] ? true : false;
        this.editId = params['edit'];
        this.showModal('edit', params['add'] || this.editId ? true : false);
        this.setFilter(params as BookFilter);
        this.searched = this.route.snapshot.data['searched'] ?? false;
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
    const payload = this.createSearchPayload();

    console.log('book-list: payload', payload);

    this.storage.get(payload, this.sort)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => this.data = result,
        error: (error) => console.error(error)
      });
  }

  createSearchPayload() {
    let payload: null | Array<SearchRule | SearchOrRule> = [];

    console.log('book-list: filterdata', this.filterData);

    if (this.filterData) {
      payload = createSearchRule(this.filterData);
    }

    if (this.searchterm) {
      payload.push({
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
      });
    }

    return payload;
  }

  /**
   * Triggers showing add/edit form in 'add' mode
   *
   * @param  {boolean} [show=true]
   *
   * @return {void}
   */
  showAddForm(show: boolean = true): void {
    this.editId = '';
    this.showModal('edit', show);
    if (show) {
      this.history.setParam('add', 'true');
    } else {
      this.history.deleteParam(['edit', 'add']);
    }
  }

  /**
   * Removes a book by its id from storage
   *
   * @param  {string} id
   *
   * @return {void}
   */
  remove(id: string): void {
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
  save(data: Partial<BookData>): void {
    // if in edit mode update the current book
    // and hide add/edit form afterwards
    if (this.editId) {
      this.storage.update(this.editId, data)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            console.log('does it run?');
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
  edit(id: string): void {
    this.editId = id;
    this.showModal('edit', true);
    this.history.setParam('edit', id);
  }

  /**
   * Event handler for search input. Uses queryParams
   * to trigger search.
   *
   * @return {void}
   */
  search(): void {
    const val = this.searchfield.nativeElement.value;

    if (!val) {
      return;
    }

    this.router.navigate(['/search'], {
      queryParams: {
        term: val,
        chart: this.chartVisible ? true : undefined
      }
    });
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
   * @param  {string} id id as defined in BookListComponent#modalVisible
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
  filter(data: BookFilter): void {

    console.log('run filter');

    this.router.navigate(['/filter'], {
      queryParams: {
        chart: this.chartVisible ? true : undefined,
        ...data
      }
    });

    this.showModal('filter', false);
  }

  /**
   * Sets filter information based on
   * passed BookFilter params.
   *
   * @param  {BookFilter} data
   *
   * @return {void}
   */
  setFilter(data: BookFilter): void {
    // reset if passed param object is empty
    if (!Object.keys(data).length) {
      this.filterData = null;
      this.activeFilter = [];
      return;
    }

    const filter: { label: string; value: string }[] = [];

    // create string representations of active filters
    Object.keys(filterLabels).map((k) => {
      const key = k as keyof BookFilter;
      const value = String(data[key]);

      // ignore empty ones
      if (['null', 'all', 'undefined'].includes(value)) {
        return;
      }

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

    this.filterData = data;
    this.activeFilter = filter;
  }

  /**
   * Toggles visibility of data graph
   *
   * @return {void}
   */
  toggleChart(): void {
    this.chartVisible = !this.chartVisible;
    this.history.setParam('chart', this.chartVisible ? true : undefined);
  }

  /**
   * Resets whole view with search, filtering, sorting
   * and reloads book list.
   *
   * @return {void}
   */
  reset(): void {
    this.router.navigate(['/'], {
      queryParams: {
        chart: this.chartVisible ? true : undefined
      }
    });
  }
}
