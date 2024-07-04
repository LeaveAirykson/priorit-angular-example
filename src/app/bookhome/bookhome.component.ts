import { Component } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';

/**
 * Component used as wrapper around booklist view.
 * It handles showing form and edit state based on query params.
 */
@Component({
  selector: 'app-bookhome',
  templateUrl: './bookhome.component.html',
})
export class BookhomeComponent {
  id!: string;
  formVisible = false;
  /**
   * unspecific options used to change behaviour
   * of the example application
   */
  options: { [key: string]: any; } = {
    validateIsbnChecksum: true
  }

  constructor(private router: Router) {
    this.router.events.subscribe((e) => {
      if (e instanceof ActivationEnd) {
        this.id = e.snapshot.queryParams['id'];
        this.formVisible = e.snapshot.queryParams['showForm'];
      }
    });
  }

  /**
   * Overrides example options to change
   * behaviour of the example application
   *
   * @param  {object} opt
   * @param  {string} opt.key
   * @param  {any}    opt.val
   *
   * @return {void}
   */
  overrideOption(opt: { key: string; val: any }) {
    this.options[opt.key] = opt.val;
  }

  hideForm() {
    this.formVisible = false;
    this.router.navigate(['/']);
  }
}
