import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book, BookData } from 'src/app/interfaces/book.interface';
import { StorageResponse } from 'src/app/interfaces/storageresponse.interface';
import { SortEvent } from '../directives/sortby.directive';
import { SearchOrRule, SearchRule } from '../interfaces/searchrule.interface';
import { matchesSearchRule, stripDelimiter } from '../utilities/book.helper';

/**
 * Service to manage the book storage.
 * As there is no backend, this is more of a mock service to imitate
 * real http requests. Data will be stored in clients localStorage.
 */
@Injectable({
  providedIn: 'root'
})

export class BookService {
  storename = 'bookstorage';
  data: Book[] = [];

  constructor() {
    this.data = JSON.parse(localStorage.getItem(this.storename) ?? '[]');
  }

  /**
   * Create a book and saves it to storage
   *
   * @param  {BookData} book
   *
   * @return {Observable<StorageResponse>}
   */
  create(data: BookData): Observable<StorageResponse> {
    return new Observable((subscriber) => {
      this.data.push(new Book(data));
      this.save();

      subscriber.next({
        success: true,
        message: 'Das Buch wurde erfolgreich hinzufügt!',
      });

      subscriber.complete();
    });
  }

  /**
   * Updates a book with given data
   *
   * @param  {string}             id   Id of the book
   * @param  {Partial<BookData>}  data Update data
   *
   * @return {Observable<StorageResponse>}
   */
  update(id: string, data: Partial<BookData>): Observable<StorageResponse> {
    return new Observable((subscriber) => {

      let bookIdx = this.data.findIndex((b) => b.id == id);

      if (bookIdx < 0) {
        throw new Error(`Das Buch mit der id ${id} existiert nicht!`);
      }

      delete data.id;
      this.data[bookIdx] = new Book(({ ...this.data[bookIdx], ...data } as BookData));
      this.save();

      subscriber.next({
        success: true,
        message: 'Änderung wurde erfolgreich gespeichert.'
      });

      subscriber.complete();
    });
  }

  /**
   * Remove a book by given id
   *
   * @param  {string} id
   *
   * @return {Observable<StorageResponse>}
   */
  removeById(id: string): Observable<StorageResponse> {
    return new Observable((subscriber) => {
      this.data = this.data.filter((b) => b.id !== id);
      this.save();

      subscriber.next({
        success: true,
        message: 'Das Buch wurde erfolgreich gelöscht!',
      });

      subscriber.complete();
    });
  }

  /**
   * Retrieve a book by its id
   *
   * @param  {string} id
   *
   * @return {Observable<Book>}
   */
  getById(id: string): Observable<Book> {
    return this.getByProp('id', id);
  }

  /**
   * Retrieve a book by its isbn number
   *
   * @param  {string} isbn
   *
   * @return {Observable<Book>}
   */
  getByIsbn(isbn: string): Observable<Book> {
    return new Observable((subscriber) => {
      const result = this.data.find((b) => stripDelimiter(b['isbn']) == stripDelimiter(isbn));
      subscriber.next(result);
      subscriber.complete();
    });
  }

  /**
   * Retrieve a book by its property
   *
   * @param  {keyof Book} prop property to find by
   * @param  {any}        val  value to find by
   *
   * @return {Observable<Book>}
   */
  getByProp(prop: keyof Book, val: any): Observable<Book> {
    return new Observable((subscriber) => {
      const result = this.data.find((b) => b[prop] == val);
      subscriber.next(result);
      subscriber.complete();
    });
  }

  /**
   * Flexible retrieval based on defined search rules
   * which support and/or logic.
   *
   * @param  {Array<SearchRule|SearchOrRule>} [rules]
   *
   * @return {Observable<Book>[]}
   */
  get(
    rules?: Array<SearchRule | SearchOrRule>,
    sort?: SortEvent
  ): Observable<Book[]> {
    return new Observable((subscriber) => {
      let result = this.data;

      if (rules && rules.length) {
        result = this.data.filter((b) => matchesSearchRule(b, rules));
      }

      if (sort) {
        result.sort((a, b) => {
          if (sort.direction == 'asc') {
            return a[sort.column as keyof Book] < b[sort.column as keyof Book] ? -1 : 1;
          }

          return a[sort.column as keyof Book] < b[sort.column as keyof Book] ? 1 : -1;
        });
      }

      subscriber.next(result);
      subscriber.complete();
    });
  }

  /**
   * Saves data to localStorage
   *
   * @return {void}
   */
  private save(): void {
    localStorage.setItem(this.storename, JSON.stringify(this.data));
  }
}
