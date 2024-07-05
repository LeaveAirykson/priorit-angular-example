import { Component } from '@angular/core';

/**
 * Component used as wrapper around booklist view.
 * It handles showing form and edit state based on query params.
 */
@Component({
  selector: 'app-bookhome',
  templateUrl: './bookhome.component.html',
})
export class BookhomeComponent {
  /**
   * unspecific options used to change behaviour
   * of the example application
   */
  options: { [key: string]: any; } = {
    validateIsbnChecksum: true
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
}
