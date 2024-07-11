import { EventEmitter, Injectable, Output } from '@angular/core';
import { Book } from '../../book/models/book.class';
import { O } from '../models/generics.interface';

/**
 * Service to handle demo related logic.
 */
@Injectable({
  providedIn: 'root'
})
export class DemoService {
  @Output() updated: EventEmitter<O> = new EventEmitter();

  options: O = {
    validateIsbnCheckSum: true
  };

  constructor() {
    this.options = this.getData();
  }

  setOption(key: string, value: any) {
    this.options[key] = value;
    this.write();
    this.updated.emit(this.options);
  }

  getOption(key: string) {
    return this.options[key] ?? undefined;
  }

  createDummyData() {
    const data = [
      new Book({
        id: 'b1719851591832',
        title: 'Die Verwandlung',
        isbn: '978-3-15-009900-1',
        year: 1915,
        pagecount: 88,
        language: 'Deutsch',
        ddc: '833.91',
        remuneration: 125
      }),
      new Book({
        id: 'b1719851609568',
        title: 'Schatten über Monte Carasso',
        isbn: '978-3-8479-0167-9',
        year: 2024,
        pagecount: 368,
        language: 'Deutsch',
        ddc: '833.92',
        remuneration: 143
      }),
      new Book({
        id: 'b1719909857393',
        title: '1Q84',
        isbn: '978-0-0995-4906-2',
        year: 2012,
        pagecount: 816,
        language: 'Englisch',
        ddc: '895.635',
        remuneration: 150
      }),
      new Book({
        id: 'b1719910727936',
        title: 'Do Androids Dream of Electric Sheep?',
        isbn: '978-0-5750-7993-9',
        year: 2007,
        pagecount: 224,
        language: 'Englisch',
        ddc: '823.92',
        remuneration: 120
      }),
      new Book({
        id: 'b1719911125599',
        title: 'Stories of Your Life and Others',
        isbn: '110-19-7212-2',
        year: 2016,
        pagecount: 304,
        language: 'Englisch',
        ddc: '823.92',
        remuneration: 130
      }),
      new Book({
        id: 'b1719911547938',
        title: 'Shogun',
        isbn: '3442356180',
        year: 1975,
        pagecount: 1136,
        language: 'Deutsch',
        ddc: '833.92',
        remuneration: 180
      }),
      new Book({
        id: 'b1719851591836',
        title: 'The Dark Tower',
        isbn: '978-1-473-65554-6',
        year: 2017,
        language: 'Englisch',
        pagecount: 237,
        ddc: '823.91',
        remuneration: 120
      })
    ];

    localStorage.setItem('bookstorage', JSON.stringify(data));

    window.location.reload();
  }

  private write() {
    localStorage.setItem('demoOptions', JSON.stringify(this.options));
  }

  private getData() {
    const stored = JSON.parse(localStorage.getItem('demoOptions') ?? '{}');
    return { ...this.options, ...stored };
  }
}
