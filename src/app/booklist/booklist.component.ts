import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Book } from '../interfaces/book.interface';
import { BookFilter } from '../interfaces/bookfilter.interface';
import { SearchOrRule, SearchRule } from '../interfaces/searchrule.interface';
import { BookService } from '../services/book.service';
import { HistoryService } from '../services/history.service';
import { NotificationService } from '../services/notification.service';
import { filter2Rule, filterLabels, operatorMap } from '../utilities/book.helper';

/**
 * This component lists all books found in storage.
 * Additionally offers some controls to search, filter and sort the data.
 */
@Component({
  selector: 'app-booklist',
  templateUrl: './booklist.component.html',
})
export class BooklistComponent implements OnDestroy, AfterViewInit {
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
  sort: { property: keyof Book; direction: 'desc' | 'asc', currentEl?: HTMLElement } = {
    property: 'title',
    direction: 'asc'
  };
  activeFilter: { label: string; value: string }[] = [];
  modalVisible: { [key: string]: boolean } = {
    filter: false,
    edit: false
  };

  constructor(
    private router: Router,
    private storage: BookService,
    private notification: NotificationService,
    private history: HistoryService) {

    this.router.events.pipe(takeUntil(this.destroy$))
      .subscribe((e) => {
        if (e instanceof ActivationEnd) {
          if (e.snapshot.routeConfig?.path == 'search') {
            this.searchterm = e.snapshot.queryParams['term'];
          }

          if (e.snapshot.routeConfig?.path == 'filter') {
            this.setActiveFilter(e.snapshot.queryParams as BookFilter);
          }

          if (e.snapshot.queryParams['add']) {
            this.showModal('edit', true);
          } else {
            this.editId = e.snapshot.queryParams['edit'];
            this.showModal('edit', this.editId ? true : false);
          }

          this.loadBooks();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  ngAfterViewInit(): void {
    this.setSort('title', 'asc', this.titleheadcell.nativeElement);
  }

  /**
   * Load books from storage
   *
   * @return {void}
   */
  loadBooks(): void {
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

    this.storage.get(payload, this.sort)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => this.data = result,
        error: (error) => console.error(error)
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
   * Triggers showing add/edit form in 'add' mode
   *
   * @return {void}
   */
  showAddForm(id = ''): void {
    this.editId = id;
    this.showModal('edit', true);
    if (!id) {
      this.history.setParam('add', 'true');
    } else {
      this.history.setParam('edit', id);
    }
  }

  /**
   * Hides edit/add form
   *
   * @return {void}
   */
  hideAddForm(): void {
    this.showModal('edit', false);
    this.history.removeParam(['edit', 'add']);
  }

  /**
   * Removes a book by its id from storage
   *
   * @param  {string} id
   *
   * @return {void}
   */
  removeBook(id: string): void {

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
   * Saves a book to storage
   *
   * @param  {Book} data
   *
   * @return {void}
   */
  saveBook(data: Book): void {
    if (this.editId) {
      this.storage.update(this.editId, data)
        .pipe(takeUntil(this.destroy$))
        .subscribe((response) => {
          this.notification.success(response.message);
          this.hideAddForm();
        });
    } else {
      this.storage.create(data)
        .pipe(takeUntil(this.destroy$))
        .subscribe((response) => {
          this.notification.success(response.message);
        })
    }
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
    this.filterData = Object.keys(data).length ? data : null;

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

  toggleSortBy(property: keyof Book, ev: Event) {
    const currentEl = ev.currentTarget as HTMLElement;
    this.setSort(property, this.sort.direction == 'asc' ? 'desc' : 'asc', currentEl);
    this.loadBooks();
  }

  setSort(property: keyof Book, direction: 'desc' | 'asc', element?: HTMLElement) {
    this.sort.property = property;
    this.sort.direction = direction;

    if (this.sort.currentEl) {
      this.sort.currentEl.classList.remove('is-sorted', 'is-sorted-asc', 'is-sorted-desc');
    }

    if (element) {
      element.classList.remove('is-sorted', 'is-sorted-asc', 'is-sorted-desc');
      element.classList.add('is-sorted', 'is-sorted-' + this.sort.direction);
    }

    this.sort.currentEl = element;
  }

  /**
   * Resets whole view with search, filtering, sorting
   * and reloads book list.
   */
  reset(): void {
    this.router.navigate(['/']);
  }
}
