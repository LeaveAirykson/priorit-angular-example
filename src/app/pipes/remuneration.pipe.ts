import { Pipe, PipeTransform } from '@angular/core';
import { Book } from '../interfaces/book.interface';
import { calculateRemuneration } from '../utilities/book.helper';

/**
 * This pipe is used to calculate the remuneration value
 * of a book.
 */
@Pipe({
  name: 'remuneration'
})
export class RemunerationPipe implements PipeTransform {

  transform(data: Book): number {
    return calculateRemuneration(data);
  }

}
