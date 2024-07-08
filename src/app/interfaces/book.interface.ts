import { calculateRemuneration } from '../utilities/book.helper';
export type BookData = {
  id?: string;
  title: string;
  isbn: string;
  year?: number;
  pagecount?: number;
  language?: string;
  ddc?: string;
  remuneration?: number;
}

export class Book {
  id: string;
  title: string;
  isbn: string;
  year: number;
  pagecount: number;
  language: string;
  ddc: string;
  remuneration: number;

  constructor(data: BookData) {
    this.id = data.id ?? 'b' + Date.now();
    this.title = data.title;
    this.isbn = data.isbn;
    this.year = data.year ? Number(data.year) : 0;
    this.pagecount = data.pagecount ? Number(data.pagecount) : 0;
    this.language = data.language ?? '';
    this.ddc = data.ddc ?? '';
    this.remuneration = calculateRemuneration(this);
  }
}
