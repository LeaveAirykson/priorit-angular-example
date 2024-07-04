import { Component, EventEmitter, Output } from '@angular/core';

/**
 * This component is not a practical use case, its just here
 * to ease the testing of the example application.
 */
@Component({
  selector: 'app-exampleoptions',
  templateUrl: './exampleoptions.component.html',
  styleUrls: ['./exampleoptions.component.css']
})

export class ExampleoptionsComponent {
  @Output() update: EventEmitter<{ key: string; val: any }> = new EventEmitter();

  isOpen = false;
  isbnChecksumActive = true;

  toggle() {
    this.isOpen = !this.isOpen;
  }

  toggleIsbnChecksum(event: Event) {
    const checked = (event.currentTarget as HTMLInputElement).checked;

    this.update.emit({ key: 'validateIsbnChecksum', val: checked });
    this.isbnChecksumActive = checked;
  }

  createDummyData() {
    const data = [
      {
        id: 'b1719851591832',
        title: 'Die Verwandlung',
        isbn: '978-3-15-009900-1',
        year: 1915,
        pagecount: 88,
        language: 'Deutsch',
        ddc: '833.91'
      },
      {
        id: 'b1719851609568',
        title: 'Schatten über Monte Carasso',
        isbn: '978-3-8479-0167-9',
        year: 2024,
        pagecount: 368,
        language: 'Deutsch',
        ddc: '833.92'
      },
      {
        id: 'b1719909857393',
        title: '1Q84',
        isbn: '978-0-0995-4906-2',
        year: 2012,
        pagecount: 816,
        language: 'Englisch',
        ddc: '895.635'
      },
      {
        id: 'b1719910727936',
        title: 'Do Androids Dream of Electric Sheep?',
        isbn: '978-0-5750-7993-9',
        year: 2007,
        pagecount: 224,
        language: 'Englisch',
        ddc: '823.92'
      },
      {
        id: 'b1719911125599',
        title: 'Stories of Your Life and Others',
        isbn: '110-19-7212-2',
        year: 2016,
        pagecount: 304,
        language: 'Englisch',
        ddc: '823.92'
      },
      {
        id: 'b1719911547938',
        title: 'Shogun',
        isbn: '3442356180',
        year: 1975,
        pagecount: 1136,
        language: 'Deutsch',
        ddc: '833.92'
      }
    ];

    localStorage.setItem('bookstorage', JSON.stringify(data));

    window.location.reload();
  }
}
