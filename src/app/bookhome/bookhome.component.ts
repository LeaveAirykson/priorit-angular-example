import { Component } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-bookhome',
  templateUrl: './bookhome.component.html',
})
export class BookhomeComponent {
  id!: string;
  formVisible = false;
  validateIsbnChecksum = true;

  constructor(private router: Router) {
    this.router.events.subscribe((e) => {
      if (e instanceof ActivationEnd) {
        this.id = e.snapshot.queryParams['id'];
        this.formVisible = e.snapshot.queryParams['showForm'];
      }
    });
  }

  exampleOptions(opt: { key: string; val: any }) {
    if (opt.key == 'validateIsbnChecksum') {
      this.validateIsbnChecksum = opt.val;
    }
  }

  hideForm() {
    this.formVisible = false;
    this.router.navigate(['/']);
  }
}
