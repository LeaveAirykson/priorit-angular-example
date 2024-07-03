import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Book } from 'src/app/interfaces/book.interface';
import { BookService } from 'src/app/services/book.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-booklist',
  templateUrl: './booklist.component.html',
  styleUrls: ['./booklist.component.css']
})
export class BooklistComponent implements OnInit {
  data: Book[] = [];
  searched: string | null = null;
  @ViewChild('searchfield') searchfield: ElementRef<HTMLInputElement>;
  form: FormGroup;

  constructor(
    private router: Router,
    private storage: BookService,
    private notification: NotificationService) { }

  ngOnInit(): void {
    this.loadBooks();
  }

  /**
   * Load books from storage
   *
   * @return {void}
   */
  loadBooks() {
    this.storage.getData()
      .subscribe({
        next: (result) => this.data = result,
        error: (error) => console.error(error)
      });
  }

  edit(id: string) {
    this.router.navigate(['/'], { queryParams: { showForm: true, id } });
  }

  remove(id: string) {
    this.storage.removeById(id)
      .subscribe((response) => {
        if (response.success) {
          this.notification.success(response.message);
          this.data = this.data.filter((b) => b.id != id);
        } else {
          this.notification.error(response.message);
        }
      })
  }

  search(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.value) {
      this.resetSearch();
      return;
    }

    this.storage.search([
      {
        or: [{
          property: 'isbn',
          operator: 'regex',
          value: input.value
        },
        {
          property: 'title',
          operator: 'regex',
          value: input.value,
        }]
      }
    ]).subscribe(result => {
      this.data = result;
      this.searched = input.value;
    });
  }

  resetSearch() {
    this.searchfield.nativeElement.value = '';
    this.searched = null;
    this.loadBooks();
  }
}
