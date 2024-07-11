import { Book } from './book.class';

/**
 * Rule by which Books will be searched by.
 */
export interface SearchRule {
  property: keyof Book;
  value: any;
  value2?: any;
  operator?: string;
  flags?: string;
}
