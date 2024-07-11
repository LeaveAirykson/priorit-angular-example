import { TestBed } from '@angular/core/testing';

import { BookService } from './book.service';
import { Book } from '../models/book.class';
import { firstValueFrom } from 'rxjs';
import { createSearchRule } from '../utilities/create-search-rule.helper';

describe('BookService', () => {
  let service: BookService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getValue', async () => {
    const data = [
      new Book({
        language: 'Deutsch',
        year: 1990,
        title: 'A',
        isbn: ' 3-86680-192-0',
        pagecount: 100
      }),
      new Book({
        language: 'Englisch',
        year: 1989,
        title: 'A',
        isbn: ' 3-86680-192-0',
        pagecount: 100
      })
    ];

    service.data = data;
    const rule1 = createSearchRule({ year: 'gte', yearStart: 1900 });
    const rule2 = createSearchRule({ year: 'lt', yearStart: 1900 });
    const rule3 = createSearchRule({ year: 'eq', yearStart: 1990 });

    const result1 = await firstValueFrom(service.get(rule1));
    const result2 = await firstValueFrom(service.get(rule2));
    const result3 = await firstValueFrom(service.get(rule3));

    expect(result1).toEqual(data);
    expect(result2).toEqual([]);
    expect(result3).toEqual([data[0]]);

  });
});
