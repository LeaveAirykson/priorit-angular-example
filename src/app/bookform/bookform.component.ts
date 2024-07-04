import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { BookService } from '../services/book.service';
import { NotificationService } from '../services/notification.service';
import { isbnChecksumValidator, isbnFormatValidator, isbnUsedAsyncValidator } from '../utilities/book.validator';

/**
 * This component displays the edit/add form for books.
 */
@Component({
  selector: 'app-bookform',
  templateUrl: './bookform.component.html',
})

export class BookformComponent implements OnInit, OnDestroy {
  @ViewChild('title') titleInput: ElementRef<HTMLInputElement>;
  @Input() set id(id: string) { this.loadBookById(id); }
  @Input() set validateIsbnChecksum(validate: boolean) { this.toggleIsbnChecksumValidator(validate); }
  form!: FormGroup;
  destroy$ = new Subject();
  editmode = false;

  /**
   * Regex patterns for validation
   */
  patterns = {
    year: '^[0-9]{4}$',
    pagecount: '^[0-9]{1,}$',
    ddc: '^[0-9]{3}\.[0-9]{1,5}$|^[0-9]{3}$'
  };

  /**
   * Default messages for validation errors based on error key.
   */
  errorMessagesDefaults: { [key: string]: string } = {
    required: 'Dieses Feld ist ein Pflichtfeld',
    isbnUsed: 'ISBN bereits in Verwendung',
    isbnInvalidFormat: 'Ungültiges Format oder unerlaubte Zeichen verwendet',
    isbnChecksum: 'Ungültige ISBN Prüfziffer',
    pattern: 'Ungültiges Format'
  }

  /**
   * Messages for validation errors for specific form fields matching
   * the key as id value.
   */
  errorMessages: { [key: string]: { [key: string]: string } | undefined } = {
    year: {
      pattern: 'Ungültige Jahreszahl'
    }
  }

  constructor(
    private fb: FormBuilder,
    private storage: BookService,
    private router: Router,
    private notification: NotificationService) {

    this.form = this.fb.group({
      id: [''],
      title: ['', [Validators.required]],
      year: ['', [Validators.pattern(this.patterns.year)]],
      pagecount: ['', [Validators.pattern(this.patterns.pagecount)]],
      language: ['Deutsch', { nonNullable: true }],
      ddc: ['', [Validators.pattern(this.patterns.ddc)]],
      isbn: ['',
        [Validators.required, isbnFormatValidator, isbnChecksumValidator],
        [isbnUsedAsyncValidator(this.storage)]
      ],
    });
  }

  ngOnInit(): void {
    this.focusTitleInput();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  /**
   * Submission callback for the form.
   *
   * @return {void}
   */
  submit() {
    if (!this.form.valid) {
      return;
    }

    if (this.editmode) {
      this.storage.update(this.form.value['id'], this.form.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe((response) => {
          this.notification.success(response.message);
          this.router.navigate(['/']);
        });
    } else {
      this.storage.create(this.form.value)
        .subscribe((response) => {
          this.form.reset();
          this.notification.success(response.message);
          this.focusTitleInput();
        })
    }
  }

  /**
   * Toggles the validator for isbn checksum. Not a real
   * use case here, it only exists to ease testing the
   * rest of the form with dummy content.
   *
   * @param  {boolean} activate
   *
   * @return {void}
   */
  private toggleIsbnChecksumValidator(activate: boolean) {
    if (activate) {
      this.form.controls['isbn'].addValidators(isbnChecksumValidator);
    } else {
      this.form.controls['isbn'].removeValidators(isbnChecksumValidator);
    }

    this.form.controls['isbn'].updateValueAndValidity();
    this.form.updateValueAndValidity();
  }

  /**
   * Loads in a book by its id and patches data in the edit form.
   *
   * @param  {string} id
   *
   * @return {void}
   */
  private loadBookById(id?: string) {
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

  /**
   * Focuses the 'title' input field if it exists.
   *
   * @return {void}
   */
  private focusTitleInput() {
    if (this.titleInput) {
      this.titleInput.nativeElement.focus();
    }
  }
}
