import { SearchRule } from './search-rule.interface';

/**
 * A search rule wrapper to use 'or' logic
 * instead of 'and'.
 */
export interface SearchOrRule {
  or: SearchRule[]
}
