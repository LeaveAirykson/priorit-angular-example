import { Book } from './book.interface';

export type SearchOrRule = {
  or: SearchBaseRule[]
}

export type SearchBaseRule = {
  property: keyof Book;
  value: any;
  operator?: string;
  flags?: string;
}

export type SearchRule = SearchOrRule | SearchBaseRule;
