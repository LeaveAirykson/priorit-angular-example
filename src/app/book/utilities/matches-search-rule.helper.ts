import { Book } from '../models/book.class';
import { SearchOrRule } from '../models/search-or-rule.interface';
import { SearchRule } from '../models/search-rule.interface';
import { stripDelimiter } from './book.helper';

/**
 * Helper to check if a book matches the passed search rules.
 * Per Default this method only returns the book as a match if
 * all rules match. Use the param 'or=true' to mark one match as sufficient.
 *
 * @param  {Book} book
 * @param  {Array<SearchRule|SearchOrRule>} rules
 * @param  {boolean} [or=false] if true only one rule needs to match.
 *
 * @return {boolean}
 */
export function matchesSearchRule(book: Book, rules: Array<SearchRule | SearchOrRule>, or = false): boolean {
  let matches = false;

  for (const rule of rules) {
    // recursive matches rules in 'or' mode
    if ('or' in rule) {
      matches = matchesSearchRule(book, rule['or'], true);
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

        case 'range':
          matches = book[rule.property] >= rule.value && book[rule.property] <= rule.value2;
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
