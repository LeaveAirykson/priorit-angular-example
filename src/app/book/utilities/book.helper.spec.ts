import { Book } from '../models/book.class';
import { sortBooks, stripDelimiter } from './book.helper';

describe('BookHelper', () => {
  it('stripDelimiter', () => {
    const checks = [
      { input: ' one string ', check: 'onestring' },
      { input: 500, check: '500' },
      { input: '--0 000-0000 ', check: '00000000' }
    ];

    checks.forEach((check) => {
      expect(stripDelimiter(check.input)).toBe(check.check);
    });
  });

  it('sortBooks', () => {
    const data = [
      { id: 'b1', title: 'X', remuneration: 1, pagecount: 1 },
      { id: 'b2', title: 'Z', remuneration: 10, pagecount: 50 },
      { id: 'b3', title: 'A', remuneration: 8, pagecount: 500 },
      { id: 'b4', title: 'B', remuneration: 5, pagecount: 100 },
    ];

    sortBooks(data as Book[], 'title');
    expect(data[0].title).toBe('A');

    sortBooks(data as Book[], 'pagecount', 'desc');
    expect(data[0].pagecount).toBe(500);
  });
});
