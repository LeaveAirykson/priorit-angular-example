/**
 * Minimal dataset needed for creating a Book instance
 */
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
