/**
 * Filter object used in retrieving Books
 */
export type BookFilter = {
  year: string;
  yearStart: number;
  yearEnd: number;
  pagecount: string;
  pagecountStart: number;
  pagecountEnd: number;
  language: string[];
  ddc: string;
  remuneration: string;
  remunerationStart: number;
  remunerationEnd: string;
}
