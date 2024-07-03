import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, map, of } from 'rxjs';
import { BookService } from '../services/book.service';
import { isValidIsbn, stripDelimiter } from './book.helper';

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

export function isbnFormatValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }

  const value = stripDelimiter(control.value);
  const rege = /^([0-9]{9}[0-9X]{1}|[0-9]{13})$/gm;
  return rege.test(value) ? null : { isbnInvalidFormat: true };
};

export function isbnChecksumValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }

  if (![10, 13].includes(stripDelimiter(control.value).length)) {
    return null;
  }

  return isValidIsbn(control.value) ? null : { isbnChecksum: true };
};
