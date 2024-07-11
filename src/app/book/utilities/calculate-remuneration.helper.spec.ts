import { Book } from '../models/book.class';
import { calculateRemuneration } from './calculate-remuneration.helper';

describe('calculateRemuneration', () => {
  it('should resolve without error', () => {
    const data = [
      { id: 'b1', title: 'X', remuneration: 136, pagecount: 120, language: 'Deutsch', year: 1980 },
      { id: 'b2', title: 'Z', remuneration: 115, pagecount: 50, language: 'Englisch', year: 1980 },
      { id: 'b3', title: 'A', remuneration: 165, pagecount: 600, language: 'Deutsch', year: 2000 },
      { id: 'b4', title: 'B', remuneration: 150, pagecount: 500, year: 2000 },
      { id: 'b3', title: 'W', remuneration: 132, pagecount: 250, language: 'Deutsch', year: 2010 },
    ];

    data.forEach((book) => {
      expect(calculateRemuneration(book as Book)).toBe(book.remuneration);
    });
  });
});
