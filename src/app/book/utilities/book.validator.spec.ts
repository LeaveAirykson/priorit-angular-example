import { isValidIsbnChecksum, isValidIsbnFormat } from './book.validator';

describe('BookValidator', () => {
  it('isValidIsbnFormat', () => {
    const checks = [
      { input: '1234567890', check: true },
      { input: 'A23456789', check: false },
      { input: '123-456-789-0', check: true },
      { input: '123-456-789-0123', check: true },
      { input: 'abc', check: false }
    ];

    checks.forEach((check) => {
      expect(isValidIsbnFormat(check.input)).toBe(check.check);
    });
  });

  it('isValidIsbnChecksum', () => {
    const checks = [
      { input: '3-86680-192-0', check: true },
      { input: '978-3-12-732320-8', check: false },
      { input: '978-3-12-732320-7', check: true },
      { input: '978-3-406-81490-7', check: true },
      { input: '3-86680-192-1', check: false }
    ];

    checks.forEach((check) => {
      expect(isValidIsbnChecksum(check.input)).toBe(check.check);
    });
  });
});
