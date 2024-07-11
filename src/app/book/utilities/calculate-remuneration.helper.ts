import { Book } from '../models/book.class';

/**
 * Calculates remuneration value for a given book
 *
 * @param  {Book}   book
 *
 * @return {number}
 */
export function calculateRemuneration(data: Book): number {
  let result = 100;
  let additions = 0;

  /** Multiplication factor based on page count */
  const factorRanges = [
    { from: 1, to: 49, factor: 0.7 },
    { from: 50, to: 99, factor: 1 },
    { from: 100, to: 199, factor: 1.1 },
    { from: 200, to: 299, factor: 1.2 },
    { from: 300, to: 499, factor: 1.3 },
    { from: 500, factor: 1.5 }
  ];

  /**
   * Methods to calculate additional remuneration
   */
  const additionsFn = {
    year: (year: number) => year > 0 && year < 1990 ? 15 : 0,
    language: (lang: string, base: number) => lang && lang.toLowerCase() == 'deutsch' ? 10 * base / 100 : 0
  };

  // multiply by page related factor
  if (data.pagecount) {
    for (const range of factorRanges) {
      if (data.pagecount >= range.from && (!range.to || data.pagecount <= range.to)) {
        result *= range.factor;
        break;
      }
    }
  }

  // add calculated additions
  additions += data.year ? additionsFn.year(data.year) : 0;
  additions += data.language ? additionsFn.language(data.language, result) : 0;

  return Number((result + additions).toFixed(2));
}
