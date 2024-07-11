import { Book } from './book.class';

export interface SearchRule {
  property: keyof Book;
  value: any;
  value2?: any;
  operator?: string;
  flags?: string;
}
