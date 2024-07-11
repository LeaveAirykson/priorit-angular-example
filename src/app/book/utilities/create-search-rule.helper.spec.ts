import { createSearchRule } from './create-search-rule.helper';

describe('CreateSearchRule', () => {
  it('should resolve without error', () => {
    const checks = [
      {
        input: { year: 'range', yearStart: '2000', yearEnd: '2024', language: 'all' },
        check: JSON.stringify([{ property: 'year', operator: 'range', value: 2000, value2: 2024 }])
      },
      {
        input: { year: 'all', yearStart: '1900', language: 'all' },
        check: '[]'
      },
      {
        input: { year: 'all', language: ['all'] },
        check: '[]'
      },
      {
        input: { year: 'eq', yearStart: '2020', language: ['Deutsch'] },
        check: JSON.stringify([{ property: 'year', operator: 'eq', value: 2020, value2: null }, { or: [{ property: 'language', value: 'Deutsch' }] }])
      },
      {
        input: { year: 'all', yearStart: '1900', language: ['Deutsch', 'Englisch'] },
        check: JSON.stringify([{ or: [{ property: 'language', value: 'Deutsch' }, { property: 'language', value: 'Englisch' }] }])
      }
    ];

    checks.forEach((check) => {
      expect(JSON.stringify(createSearchRule(check.input))).toBe(check.check);
    });
  });
});
