import { Book } from './book.interface';

export interface SearchRule {
  property: keyof Book;
  value: any;
  value2?: any;
  operator?: string;
  flags?: string;
}

export interface SearchOrRule {
  or: SearchRule[]
}
