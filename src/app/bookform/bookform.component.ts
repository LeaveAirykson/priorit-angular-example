import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Book } from '../interfaces/book.interface';
import { BookService } from '../services/book.service';
import { isbnChecksumValidator, isbnFormatValidator, isbnUsedAsyncValidator, validationPatterns } from '../utilities/book.validator';

/**
 * This component displays the edit/add form for books.
 */
@Component({
  selector: 'app-bookform',
  templateUrl: './bookform.component.html',
})

export class BookformComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('title') titleInput: ElementRef<HTMLInputElement>;
  @Input() set id(id: string) { this.loadBookById(id); }
  @Input() set validateIsbnChecksum(validate: boolean) { this.toggleIsbnChecksumValidator(validate); }
  @Output() cancel: EventEmitter<boolean> = new EventEmitter();
  @Output() submit: EventEmitter<Book> = new EventEmitter();
  form!: FormGroup;
  destroy$ = new Subject();
  editmode = false;

  /**
   * Regex patterns for validation
   */
  patterns = validationPatterns;

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
    private storage: BookService) {

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

  ngAfterViewInit(): void {
    this.focusTitleInput();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  /**
   * Emits submit event with form values as params.
   *
   * @return {void}
   */
  emit(): void {
    if (!this.form.valid) {
      return;
    }

    this.submit.emit(this.form.value);
    this.form.reset();
    this.focusTitleInput();
  }

  /**
   * Resets form and emits cancel event.
   *
   * @return {void}
   */
  abort(): void {
    this.form.reset();
    this.cancel.emit(true);
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
      this.form.reset();
      return;
    }

    this.storage.getById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((val) => {
        if (!val) {
          this.editmode = false;
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
