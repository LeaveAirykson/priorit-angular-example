import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { isbnChecksumValidator, isbnFormatValidator, isbnUsedAsyncValidator } from '../utilities/book.validator';
import { patterns } from './validationpatterns';

@Component({
  selector: 'app-bookform',
  templateUrl: './bookform.component.html',
  styleUrls: ['./bookform.component.css']
})
export class BookformComponent {
  form!: FormGroup;
  editmode = false;
  patterns = patterns;

  @Input() set id(id: string) {
    if (!id) {
      this.editmode = false;
      return;
    }

    this.storage.getById(id)
      .subscribe((val) => {
        if (!val) {
          this.editmode = false;
          this.router.navigate(['/add']);
          return;
        }

        this.editmode = true;
        this.form.patchValue(val);
      });
  }

  @Input() set validateIsbnChecksum(validate: boolean) {
    if (validate) {
      this.form.controls['isbn'].addValidators(isbnChecksumValidator);
    } else {
      this.form.controls['isbn'].removeValidators(isbnChecksumValidator);
    }

    this.form.controls['isbn'].updateValueAndValidity();
    this.form.updateValueAndValidity();
  }

  control(id: string) {
    return this.form.controls[id] as FormControl;
  }

  constructor(
    private fb: FormBuilder,
    private storage: StorageService,
    private router: Router) {

    this.form = this.fb.group({
      id: [null],
      title: ['', [Validators.required]],
      isbn: ['',
        [Validators.required, isbnFormatValidator, isbnChecksumValidator],
        [isbnUsedAsyncValidator(this.storage)]
      ],
      year: ['', [Validators.pattern(patterns.year)]],
      pagecount: ['', [Validators.pattern(patterns.pagecount)]],
      language: ['Deutsch', { nonNullable: true }],
      ddc: ['', [Validators.pattern(patterns.ddc)]],
    });
  }

  showErrors(id: string) {
    const control = this.form.get(id) as FormControl;
    return control.invalid && control.dirty && control.errors;
  }

  submit() {
    if (!this.form.valid) {
      return;
    }

    if (this.editmode) {
      this.storage.update(this.form.value['id'], this.form.value)
        .subscribe((response) => {
          console.log(response.message);
          this.router.navigate(['/add']);
        });
    } else {
      this.storage.create(this.form.value)
        .subscribe((response) => {
          this.form.reset();
          console.log(response.message);
        })
    }
  }
}
