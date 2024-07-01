import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Book } from 'src/app/interfaces/book.interface';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-booklist',
  templateUrl: './booklist.component.html',
  styleUrls: ['./booklist.component.css']
})
export class BooklistComponent {
  @Input() data: Book[] = [];
  @Output() update: EventEmitter<string> = new EventEmitter();

  constructor(private router: Router, private storage: StorageService) { }

  edit(id: string) {
    this.router.navigate(['/edit', id]);
  }

  remove(id: string) {
    this.storage.removeById(id)
      .subscribe((response) => {
        if (response.success) {
          console.log(response.message);
          this.update.emit(id);
        }
      })
  }
}
