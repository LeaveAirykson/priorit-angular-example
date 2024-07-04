import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Book } from '../interfaces/book.interface';
import { BookService } from '../services/book.service';
import { NotificationService } from '../services/notification.service';

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
  form: FormGroup;
  markedForRemoval: Book | null = null;

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
      return;
    }

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
    this.loadBooks();
  }
}
