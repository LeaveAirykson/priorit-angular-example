import { Book } from '../models/book.class';
import { RemunerationPipe } from './remuneration.pipe';

describe('RemunerationPipe', () => {
  it('create an instance', () => {
    const pipe = new RemunerationPipe();
    expect(pipe).toBeTruthy();
  });

  it('calculate remuneration', () => {
    const pipe = new RemunerationPipe();
    const book = new Book({
      language: 'Deutsch',
      year: 1990,
      title: 'A',
      isbn: ' 3-86680-192-0',
      pagecount: 100
    });
    const book2 = new Book({
      language: 'Englisch',
      year: 1989,
      title: 'A',
      isbn: ' 3-86680-192-0',
      pagecount: 100
    });

    expect(pipe.transform(book)).toBe(121);
    expect(pipe.transform(book2)).toBe(125);

  });
});
