import { Pipe, PipeTransform } from '@angular/core';
import { Book } from '../models/book.class';
import { calculateRemuneration } from '../utilities/calculate-remuneration.helper';

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
