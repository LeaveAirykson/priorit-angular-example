import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from 'src/app/interfaces/book.interface';
import { StorageResponse } from 'src/app/interfaces/storageresponse.interface';
import { calculateRemuneration, matchesSearchRule, stripDelimiter } from '../utilities/book.helper';
import { SearchOrRule, SearchRule } from '../interfaces/searchrule.interface';

/**
 * Service to manage the book storage.
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
   * @param  {Book} book
   *
   * @return {Observable<StorageResponse>}
   */
  create(book: Book): Observable<StorageResponse> {
    book.id = 'b' + Date.now();
    book.remuneration = calculateRemuneration(book);
    this.data.push(book);
    this.save();

    const response: StorageResponse = {
      message: 'Das Buch wurde erfolgreich hinzufügt!',
      success: true
    };

    return this.response<StorageResponse>(response);
  }

  /**
   * Updates a book with given data
   *
   * @param  {string}         id   Id of the book
   * @param  {Partial<Book>}  data Update data
   *
   * @return {Observable<StorageResponse>}
   */
  update(id: string, data: Partial<Book>): Observable<StorageResponse> {
    const response: StorageResponse = {
      success: false,
      message: 'Das Buch mit der id "' + id + '" existiert nicht!'
    };

    let bookIdx = this.data.findIndex((b) => b.id == id);

    if (bookIdx >= 0) {
      delete data.id;
      this.data[bookIdx] = ({ ...this.data[bookIdx], ...data } as Book);
      this.data[bookIdx].remuneration = calculateRemuneration(this.data[bookIdx]);
      this.save();
      response.success = true;
      response.message = 'Änderung wurde erfolgreich gespeichert!';
    }

    return new Observable((subscriber) => {
      subscriber.next(response);
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
    this.data = this.data.filter((b) => b.id !== id);
    this.save();

    return this.response<StorageResponse>({
      success: true,
      message: 'Das Buch wurde erfolgreich gelöscht!',
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
    const result = this.data.find((b) => stripDelimiter(b['isbn']) == stripDelimiter(isbn));
    return this.response<Book>(result);
  }

  /**
   * Retrieve all book data
   *
   * @return {Observable<Book[]>}[return description]
   */
  getData(): Observable<Book[]> {
    return this.response<Book[]>(this.data);
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
    const result = this.data.find((b) => b[prop] == val);
    return this.response<Book>(result);
  }

  /**
   * Flexible search logic based on defined search rules
   * which support and/or logic.
   *
   * @param  {Array<SearchRule|SearchOrRule>} rules
   *
   * @return {Observable<Book>[]}
   */
  search(rules: Array<SearchRule | SearchOrRule>): Observable<Book[]> {
    const result = this.data.filter((b) => matchesSearchRule(b, rules));
    return this.response<Book[]>(result);
  }

  /**
   * Saves data to localStorage
   *
   * @return {void}
   */
  private save() {
    localStorage.setItem(this.storename, JSON.stringify(this.data));
  }

  /**
   * Mocks a http response observable
   *
   * @param  {Type} data
   *
   * @return {Observable<Type>}
   */
  private response<Type>(data?: Type): Observable<Type> {
    return new Observable((subscriber) => {
      subscriber.next(data);
      subscriber.complete();
    });
  }
}
