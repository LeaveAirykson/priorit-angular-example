import { Pipe, PipeTransform } from '@angular/core';
import { Book } from '../interfaces/book.interface';
import { calculateRemuneration } from '../utilities/book.helper';

@Pipe({
  name: 'remuneration'
})
export class RemunerationPipe implements PipeTransform {

  transform(data: Book): number {
    return calculateRemuneration(data);
  }

}
