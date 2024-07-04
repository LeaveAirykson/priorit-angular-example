import { Book } from '../interfaces/book.interface';
import { SearchRule } from '../interfaces/searchrule.interface';

/**
 * Calculates remuneration value for a given book
 *
 * @param  {Book}   book
 *
 * @return {number}
 */
export function calculateRemuneration(book: Book): number {
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
  for (const range of factorRanges) {
    if (book.pagecount >= range.from && (!range.to || book.pagecount <= range.to)) {
      result *= range.factor;
      break;
    }
  }

  // add calculated additions
  additions += additionsFn.year(book.year);
  additions += additionsFn.language(book.language, result);

  return Number((result + additions).toFixed(2));
}

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
 * Helper to check if a book matches the passed search rules.
 * Per Default this method only returns the book as a match if
 * all rules match. Use the param 'or=true' to mark one match as sufficient.
 *
 * @param  {Book}         book
 * @param  {SearchRule[]} rules
 * @param  {boolean}      [or=false] if true only one rule needs to match.
 *
 * @return {boolean}
 */
export function matchesSearchRule(book: Book, rules: SearchRule[], or = false): boolean {
  let matches = false;

  for (const rule of rules) {
    // recursive matches rules in 'or' mode
    if ('or' in rule) {
      matches = matchesSearchRule(book, rule.or, true);
    }
    // otherwise match based on operator
    else {
      switch (rule.operator) {
        case 'gt':
          matches = book[rule.property] > rule.value;
          break;

        case 'gte':
          matches = book[rule.property] >= rule.value;
          break;

        case 'lte':
          matches = book[rule.property] <= rule.value;
          break;

        case 'lt':
          matches = book[rule.property] < rule.value;
          break;

        case 'not':
          matches = book[rule.property] !== rule.value;
          break;

        case 'regex':
          let flags = rule.flags ?? 'gmi';
          let teststr = String(book[rule.property]);

          // make sure to strip optional isbn delimiters
          // from book value and input value as well
          if (rule.property === 'isbn') {
            rule.value = stripDelimiter(rule.value);
            teststr = stripDelimiter(teststr);
          }

          matches = (new RegExp(rule.value, flags)).test(teststr);
          break;

        default:
          matches = book[rule.property] == rule.value;
          break;
      }
    }

    if (!or && !matches) {
      return false;
    }

    if (or && matches) {
      return true;
    }
  }

  return matches;
}

/**
 * Validates isbn value by checking length and checksum of the isbn.
 *
 * @param  {string}  isbn
 *
 * @return {boolean}
 */
export function isValidIsbnChecksum(isbn: string): boolean {
  if (!isbn) {
    return false;
  }

  isbn = stripDelimiter(isbn);

  const csdigit = isbn[isbn.length - 1];
  const digits = isbn.slice(0, isbn.length - 1);
  let sum = 0;

  if (isbn.length == 13) {
    for (let i = 0; i < 12; i++) {
      sum += i % 2 == 0 ? Number(digits[i]) : Number(digits[i]) * 3;
    }

    const checksum = (10 - (sum % 10)) % 10;
    return checksum == Number(csdigit);
  }

  if (isbn.length == 10) {
    for (let i = 0; i < 9; i++) {
      sum += Number(digits[i]) * (i + 1);
    }

    let checksum: string | number = sum % 11;
    checksum = checksum == 10 ? 'X' : checksum;
    return String(checksum) == String(csdigit);
  }

  return false;
}

/**
 * Validates isbn format (isbn-10 or isbn-13)
 *
 * @param  {string}  isbn
 *
 * @return {boolean}
 */
export function isValidIsbnFormat(isbn: string): boolean {

  const value = stripDelimiter(isbn);
  const rege = /^([0-9]{9}[0-9X]{1}|[0-9]{13})$/gm;

  return rege.test(value);
}
