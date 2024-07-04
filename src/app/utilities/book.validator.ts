import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, map, of } from 'rxjs';
import { BookService } from '../services/book.service';
import { isValidIsbnChecksum, stripDelimiter } from './book.helper';

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

  const value = stripDelimiter(control.value);
  const rege = /^([0-9]{9}[0-9X]{1}|[0-9]{13})$/gm;
  return rege.test(value) ? null : { isbnInvalidFormat: true };
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
 * Regex patterns for validation
 */
export const validationPatterns = {
  year: '^[0-9]{4}$',
  pagecount: '^[0-9]{1,}$',
  ddc: '^[0-9]{3}\.[0-9]{1,5}$|^[0-9]{3}$'
}
