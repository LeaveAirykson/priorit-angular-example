import { SortDirection } from 'src/app/core/models/sort-direction.type';
import { Book } from '../models/book.class';


/**
 * Strips optional delimiters (whitespace, hyphen) from isbn numbers.
 *
 * @param  {string} val
 *
 * @return {string}
 */
export function stripDelimiter(val: string): string {
  return val ? String(val).trim().replace(/\s|-/gm, '') : val;
}

/**
 * Map of relational operators
 * with readable long/short names
 */
export const operatorMap: { [key: string]: { long: string; short: string } } = {
  eq: { long: 'ist', short: '=' },
  gt: { long: 'größer als', short: '>' },
  gte: { long: 'größer gleich', short: '≥' },
  lt: { long: 'kleiner als', short: '<' },
  lte: { long: 'kleiner gleich', short: '≤' },
  not: { long: 'ungleich', short: '≠' },
  range: { long: 'zwischen', short: '' },
  regex: { long: 'Muster', short: 'Muster' }
};

/**
 * Map of readable labels for filters
 */
export const filterLabels: { [key: string]: string } = {
  year: 'Jahre',
  pagecount: 'Seitenanzahl',
  language: 'Sprachen',
  ddc: 'Sachgruppen',
  remuneration: 'Vergütungswerte'
}


/**
 * Sorts Books array in place by given property in given direction
 *
 * @param  {Book[]}        data
 * @param  {keyof Book}    prop
 * @param  {SortDirection} [direction='asc']
 *
 * @return {void}
 */
export function sortBooks(
  data: Book[],
  prop: keyof Book,
  direction: SortDirection = 'asc'): Book[] {
  return data.sort((a, b) => {
    if (direction == 'asc') {
      return a[prop] < b[prop] ? -1 : 1;
    }

    return a[prop] < b[prop] ? 1 : -1;
  });
}
