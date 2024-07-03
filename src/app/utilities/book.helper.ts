import { Book } from '../interfaces/book.interface';
import { SearchRule } from '../interfaces/searchrule.interface';

export function calculateRemuneration(data: Book): number {
  let result = 100;
  let additions = 0;
  let factor = 1;

  const factorRanges = [
    { from: 1, to: 49, factor: 0.7 },
    { from: 50, to: 99, factor: 1 },
    { from: 100, to: 199, factor: 1.1 },
    { from: 200, to: 299, factor: 1.2 },
    { from: 300, to: 499, factor: 1.3 },
    { from: 500, factor: 1.5 }
  ];

  const yearAdditions = [
    (year: number) => year < 1990 ? 15 : 0,
  ];

  const langAdditions = [
    (lang: string, base: number) => lang.toLowerCase() == 'deutsch' ? 10 * base / 100 : 0
  ];

  for (const range of factorRanges) {
    if (data.pagecount >= range.from && (!range.to || data.pagecount <= range.to)) {
      factor = range.factor;
      break;
    }
  }

  result *= factor;

  if (data.year) {
    for (const fn of yearAdditions) {
      additions += fn(data.year);
    }
  }

  if (data.language) {
    for (const fn of langAdditions) {
      additions += fn(data.language, result);
    }
  }

  return Number((result + additions).toFixed(2));
}

export function stripDelimiter(val: string): string {
  return val ? String(val).trim().replace(/\s|-/gm, '') : val;
}

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

export function isValidIsbn(isbn: string): boolean {
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

export function isValidIsbnFormat(isbn: string): boolean {

  const value = stripDelimiter(isbn);
  const rege = /^([0-9]{9}[0-9X]{1}|[0-9]{13})$/gm;

  return rege.test(value);
}
