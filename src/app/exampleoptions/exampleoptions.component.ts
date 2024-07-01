import { Component, EventEmitter, Output } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { Book } from '../interfaces/book.interface';

@Component({
  selector: 'app-exampleoptions',
  templateUrl: './exampleoptions.component.html',
  styleUrls: ['./exampleoptions.component.css']
})
export class ExampleoptionsComponent {
  isOpen = true;
  @Output() update: EventEmitter<{ key: string; val: any }> = new EventEmitter();

  constructor(private storage: StorageService) { }

  toggle() {
    this.isOpen = !this.isOpen;
  }

  toggleIsbnChecksum(event: Event) {
    const checked = (event.currentTarget as HTMLInputElement).checked;

    this.update.emit({ key: 'isbnChecksum', val: checked });
  }

  createDummyData() {
    const data = [
      {
        id: 'b1719851591832',
        title: 'Sämtliche Erzählungen',
        isbn: '3-596-21078-X',
        year: 1995,
        pagecount: 406,
        language: 'Deutsch',
        group: 830
      },
      {
        id: 'b1719851609568',
        title: 'Schatten über Monte Carasso',
        isbn: '978-3-8479-0167-9',
        year: 2024,
        pagecount: 368,
        language: 'Deutsch',
        group: 830
      },
      {
        title: 'Fragen an das Universum',
        isbn: '978-3-86690-780-5',
        year: 2021,
        pagecount: 312,
        language: 'Deutsch',
        group: 520
      },
    ];

    localStorage.setItem('bookstorage', JSON.stringify(data));

    window.location.reload();
  }
}
