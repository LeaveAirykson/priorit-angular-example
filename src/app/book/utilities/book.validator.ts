import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, map, of } from 'rxjs';
import { BookService } from '../services/book.service';
import { stripDelimiter } from './book.helper';

/**
 * Async form validator for checking if an isbn number is already in use.
 *
 * @param  {BookService} storage
 *
 * @return {AsyncValidatorFn}
 */
export function isbnUsedAsyncValidator(storage: BookService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {

    if (!control.value) {
      return of(null);
    }

    return storage.getByIsbn(control.value)
      .pipe(map((result) => {
        return !result ? null : result.id === control.root.get('id')?.value ? null : { isbnUsed: true };
      }));
  }
}

/**
 * Form validator for checking isbn number format
 *
 * @param  {AbstractControl}  control
 *
 * @return {ValidationErrors}
 */
export function isbnFormatValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }

  return isValidIsbnFormat(control.value) ? null : { isbnInvalidFormat: true };
};

/**
 * Form validator for checking isbn checksum
 *
 * @param  {AbstractControl}  control
 *
 * @return {ValidationErrors}
 */
export function isbnChecksumValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }

  if (![10, 13].includes(stripDelimiter(control.value).length)) {
    return null;
  }

  return isValidIsbnChecksum(control.value) ? null : { isbnChecksum: true };
};

/**
 * Validates isbn value by checking length and checksum of the isbn.
 *
 * @param  {string}  isbn
 *
 * @return {boolean}
 */
export function isValidIsbnChecksum(isbn: string): boolean {
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


/**
 * Validates isbn format (isbn-10 or isbn-13)
 *
 * @param  {string}  isbn
 *
 * @return {boolean}
 */
export function isValidIsbnFormat(isbn: string): boolean {

  const value = stripDelimiter(isbn);
  const rege = /^([0-9]{9}[0-9X]{1}|[0-9]{13})$/gm;

  return rege.test(value);
}

/**
 * Regex patterns for validation
 */
export const validationPatterns = {
  year: '^[0-9]{4}$',
  pagecount: '^[0-9]{1,}$',
  ddc: '^[0-9]{3}\.[0-9]{1,5}$|^[0-9]{3}$'
}
