import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Book } from '../interfaces/book.interface';
import { BookFilter } from '../interfaces/bookfilter.interface';
import { BookService } from '../services/book.service';
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
export class BooklistComponent implements OnInit {
  data: Book[] = [];
  searched: string | null = null;
  @ViewChild('searchfield') searchfield: ElementRef<HTMLInputElement>;
  markedForRemoval: Book | null = null;
  filterModalVisible = false;
  resultNoticeVisible = false;
  filterData: BookFilter | null = null;
  activeFilter: { label: string; value: string }[] = [];

  constructor(
    private router: Router,
    private storage: BookService,
    private notification: NotificationService) { }

  ngOnInit(): void {
    this.loadBooks();
  }

  /**
   * Load books from storage
   *
   * @return {void}
   */
  loadBooks() {
    this.storage.getData()
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
  edit(id: string) {
    this.router.navigate(['/'], { queryParams: { showForm: true, id } });
  }

  /**
   * Removes a book by its id from storage
   *
   * @param  {string} id
   *
   * @return {void}
   */
  remove(id: string) {

    if (!this.markedForRemoval) {
      this.markedForRemoval = this.data.find((b) => b.id == id) ?? null;
      return;
    }

    this.storage.removeById(id)
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
   * Event handler for search input. Uses dynamic
   * BookService.search() to retrieve data.
   *
   * @param  {Event} event
   *
   * @return {void}
   */
  search(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.value) {
      this.resetSearch();
      this.loadBooks();
      return;
    }

    this.resetFilter();

    this.storage.search([
      {
        or: [{
          property: 'isbn',
          operator: 'regex',
          value: input.value
        },
        {
          property: 'title',
          operator: 'regex',
          value: input.value,
        }]
      }
    ]).subscribe(result => {
      this.data = result;
      this.searched = input.value;
      this.resultNoticeVisible = true;
    });
  }

  /**
   * Resets search input and view and reloads books.
   *
   * @return {void}
   */
  resetSearch() {
    this.searchfield.nativeElement.value = '';
    this.searched = null;
  }

  /**
   * Marks a book for removal
   *
   * @param  {Book} book
   *
   * @return {void}
   */
  markForRemoval(book: Book | null = null) {
    this.markedForRemoval = book;
  }

  /**
   * Shows/hides filter modal
   *
   * @param  {boolean} [show=true]
   *
   * @return {void}
   */
  showFilterModal(show = true) {
    this.filterModalVisible = show;
  }

  /**
   * Shows/hides result notice
   *
   * @param  {boolean} show
   *
   * @return {void}
   */
  showResultNotice(show = true) {
    this.resultNoticeVisible = show;
  }

  /**
   * Consumes set filter and reloads data
   *
   * @param  {object} data
   *
   * @return {void}
   */
  runFilter(data: BookFilter) {
    this.showFilterModal(false);
    this.updateActiveFilter(data);
    const activeFilter = filter2Rule(data);

    if (activeFilter.length) {
      this.storage.search(activeFilter)
        .subscribe((result) => {
          this.data = result;
          this.showResultNotice();
        });
    } else {
      this.loadBooks();
    }
  }

  /**
   * Sets the labels for active filters based ond passed
   * form values
   *
   * @param  {BookFilter} data
   *
   * @return {void}
   */
  updateActiveFilter(data: BookFilter) {
    const filter: { label: string; value: string }[] = [];
    this.filterData = data;

    Object.keys(filterLabels).map((k) => {
      const value = String(data[k as keyof BookFilter]);

      // ignore empty ones
      if (['null', 'all'].includes(value)) { return; }

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
   * Resets filter related fields and data
   *
   * @return {void}
   */
  resetFilter() {
    this.showFilterModal(false);
    this.activeFilter = [];
    this.filterData = null;
  }

  /**
   * Resets whole view with search, filtering, sorting
   * and reloads book list.
   *
   * @return {void}
   */
  reset() {
    this.resetSearch();
    this.resetFilter();
    this.showResultNotice(false);
    this.loadBooks();
  }
}
