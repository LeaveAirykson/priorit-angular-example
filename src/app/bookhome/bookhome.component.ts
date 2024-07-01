import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivationEnd, Router } from '@angular/router';
import { Book } from 'src/app/interfaces/book.interface';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-bookhome',
  templateUrl: './bookhome.component.html',
})
export class BookhomeComponent implements OnInit {
  data: Book[] = [];
  id!: string;
  formVisible = false;

  constructor(
    private storage: StorageService,
    private router: Router) {
    // adapt to routing params changes
    this.router.events.subscribe((e) => {
      if (e instanceof ActivationEnd) {
        this.id = e.snapshot.params['id'];
        this.formVisible = this.id ? true : e.snapshot.data['showForm'] ?? false;
      }
    });
  }

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

  /**
   * Callback method which should be executed
   * when data changed in other components to reflect
   * new changes
   *
   * @param {string} [id]
   *
   * @return {void}
   */
  onUpdate(id?: string) {
    this.loadBooks();

    // redirects to add form if deleted book is still
    // marked as currently edited
    if (id && id == this.id && this.formVisible) {
      this.router.navigate(['/add']);
    }
  }
}
