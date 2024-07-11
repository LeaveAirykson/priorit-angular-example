import { Book } from '../models/book.class';
import { createSearchRule } from './create-search-rule.helper';
import { matchesSearchRule } from './matches-search-rule.helper';

describe('MatchesSearchRule', () => {
  it('should resolve without error', () => {
    const checks = [
      {
        input: new Book({
          title: 'A',
          isbn: '978-3-12-732320-7',
          language: 'Deutsch',
          year: 1990
        }),
      },
      {
        input: new Book({
          title: 'B',
          isbn: ' 3-86680-192-0',
          language: 'Englisch',
          year: 2000
        })
      }
    ];

    const ruleA = createSearchRule({ language: 'Deutsch' });
    const ruleB = createSearchRule({ language: ['all'] });
    const ruleC = createSearchRule({ language: ['Deutsch'], year: 'gte', yearStart: 1990 });

    expect(matchesSearchRule(checks[0].input, ruleA)).toBeTruthy();
    expect(matchesSearchRule(checks[0].input, ruleB)).toBeFalsy();
    expect(matchesSearchRule(checks[0].input, ruleC)).toBeTruthy();
    expect(matchesSearchRule(checks[1].input, ruleC)).toBeFalsy();
  });
});
