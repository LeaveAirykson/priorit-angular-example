import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BookService } from '../services/book.service';
import { isbnChecksumValidator, isbnFormatValidator, isbnUsedAsyncValidator } from '../utilities/book.validator';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-bookform',
  templateUrl: './bookform.component.html',
})

export class BookformComponent implements AfterViewInit, OnInit, OnDestroy {
  form!: FormGroup;
  editmode = false;
  patterns = {
    year: '^[0-9]{4}$',
    pagecount: '^[0-9]{1,}$',
    ddc: '^[0-9]{3}\.[0-9]{1,5}$|^[0-9]{3}$'
  };

  errorMessagesDefaults: { [key: string]: string } = {
    required: 'Dieses Feld ist ein Pflichtfeld',
    isbnUsed: 'ISBN bereits in Verwendung',
    isbnInvalidFormat: 'Ungültiges Format oder unerlaubte Zeichen verwendet',
    isbnChecksum: 'Ungültige ISBN Prüfziffer',
    pattern: 'Ungültiges Format'
  }

  errorMessages: { [key: string]: { [key: string]: string } | undefined } = {
    year: {
      pattern: 'Ungültige Jahreszahl'
    }
  }

  @ViewChild('title') titleEl: ElementRef<HTMLInputElement>;

  @Input() set id(id: string) {
    if (!id) {
      this.editmode = false;
      return;
    }

    this.storage.getById(id)
      .subscribe((val) => {
        if (!val) {
          this.editmode = false;
          this.router.navigate(['/'], { queryParams: { showForm: true } });
          return;
        }

        this.editmode = true;
        this.form.reset();
        this.form.patchValue(val);
        this.form.updateValueAndValidity();

        for (let ctrl of Object.keys(this.form.controls)) {
          this.form.controls[ctrl].markAsDirty();
        }
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

  constructor(
    private fb: FormBuilder,
    private storage: BookService,
    private router: Router,
    private notification: NotificationService) {

    this.form = this.fb.group({
      id: [null],
      title: ['', [Validators.required]],
      isbn: ['',
        [Validators.required, Validators.minLength(10), isbnFormatValidator, isbnChecksumValidator],
        [isbnUsedAsyncValidator(this.storage)]
      ],
      year: ['', [Validators.pattern(this.patterns.year)]],
      pagecount: ['', [Validators.pattern(this.patterns.pagecount)]],
      language: ['Deutsch', { nonNullable: true }],
      ddc: ['', [Validators.pattern(this.patterns.ddc)]],
    });
  }

  ngAfterViewInit(): void {
    this.titleEl.nativeElement.focus();
    console.log('form view init');

  }

  ngOnInit(): void {
    console.log('form init');
    if (this.titleEl) {
      this.titleEl.nativeElement.focus();
    }
  }

  control(id: string) {
    console.log('get ' + id);
    return this.form.controls[id] as FormControl;
  }

  submit() {
    if (!this.form.valid) {
      return;
    }

    if (this.editmode) {
      this.storage.update(this.form.value['id'], this.form.value)
        .subscribe((response) => {
          this.notification.success(response.message);
          this.router.navigate(['/']);
        });
    } else {
      this.storage.create(this.form.value)
        .subscribe((response) => {
          this.form.reset();
          this.notification.success(response.message);
          this.titleEl?.nativeElement?.focus();
        })
    }
  }

  ngOnDestroy(): void {
    console.log('form destroy');
  }

}
