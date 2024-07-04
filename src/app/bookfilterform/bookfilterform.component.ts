import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { validationPatterns } from '../utilities/book.validator';

@Component({
  selector: 'app-bookfilterform',
  templateUrl: './bookfilterform.component.html',
  styleUrls: ['./bookfilterform.component.css']
})
export class BookfilterformComponent {
  @Output() update: EventEmitter<{ [key: string]: any; }> = new EventEmitter();
  @Output() cancel: EventEmitter<boolean> = new EventEmitter();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      year: new FormControl('all', { nonNullable: true }),
      yearStart: [null, [Validators.pattern(validationPatterns.year)]],
      yearEnd: [null, [Validators.pattern(validationPatterns.year)]],
      pagecount: new FormControl('all', { nonNullable: true }),
      pagecountStart: [null, [Validators.pattern(validationPatterns.pagecount)]],
      pagecountEnd: [null, [Validators.pattern(validationPatterns.pagecount)]],
      language: new FormControl(['all'], { nonNullable: true }),
      ddc: [],
      remuneration: new FormControl('all', { nonNullable: true }),
      remunerationStart: [null, [Validators.pattern('[0-9,.]{1,}')]],
      remunerationEnd: [null, [Validators.pattern('[0-9,.]{1,}')]],
    });

    ['year', 'pagecount', 'remuneration'].map((c) => {
      this.control(c).valueChanges.subscribe((value) => this.toggleRequireForControl(c, value));
    });
  }

  control(name: string) {
    return this.form.controls[name] as FormControl;
  }

  toggleRequireForControl(prefix: string, value: string) {
    if (value == 'all') {
      this.control(prefix + 'Start').removeValidators(Validators.required);
      this.control(prefix + 'End').removeValidators(Validators.required);
    } else {
      this.control(prefix + 'Start').addValidators(Validators.required);

      if (value == 'range') {
        this.control(prefix + 'End').addValidators(Validators.required);
      }
    }

    this.control(prefix + 'Start').updateValueAndValidity();
    this.control(prefix + 'End').updateValueAndValidity();
  }

  abort() {
    this.form.reset();
    this.cancel.emit(true);
  }

  submit() {
    this.update.emit(this.form.value);
  }
}
