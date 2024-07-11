import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { BookFilter } from '../models/book-filter.type';
import { validationPatterns } from '../utilities/book.validator';

/**
 * This component shows a filter form for the booking data.
 * The form values can be prepopulated by passing supported values to the filter input.
 * It will output an update event on form submission with the form values as params.
 * On closing/canceling without submission a cancel event will be emitted.
 */
@Component({
  selector: 'app-book-filter-form',
  templateUrl: './book-filter-form.component.html'
})
export class BookFilterFormComponent implements OnInit, OnDestroy, OnChanges {
  @Output() submit: EventEmitter<BookFilter> = new EventEmitter();
  @Output() cancel: EventEmitter<boolean> = new EventEmitter();
  @Input() filter: BookFilter | null = null;
  destroy$: Subject<boolean> = new Subject();
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.createForm();
  }

  ngOnInit(): void {
    // dynamically change requirement for related fields
    ['year', 'pagecount', 'remuneration'].map((c) => {
      this.control(c).valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe((value) => this.toggleRequireFor(c, value));
    });

    // remove other languages if 'all' is selected
    this.control('language').valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value.length > 1 && value.includes('all')) {
          this.control('language').setValue(['all']);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const values = changes['filter'].currentValue;
    return !values ? this.form.reset() : this.form.patchValue(values);
  }

  createForm() {
    return this.fb.group({
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
    })
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
   * Retrieves a form control by its name
   *
   * @param  {string} name
   *
   * @return {FormControl}
   */
  control(name: string) {
    return this.form.controls[name] as FormControl;
  }

  /**
   * Finds related fields with *Start and *End suffix and toggles
   * their requirement based on passed operator field value.
   * This assumes all three fields start with the same prefix.
   * For example: year, yearStart, yearEnd.
   *
   * @param  {string} prefix
   * @param  {string} value
   *
   * @return {void}
   */
  toggleRequireFor(prefix: string, value: string) {
    const start = prefix + 'Start';
    const end = prefix + 'End';

    if (value == 'all') {
      this.control(start).removeValidators(Validators.required);
      this.control(end).removeValidators(Validators.required);
    } else {
      this.control(start).addValidators(Validators.required);

      if (value == 'range') {
        this.control(end).addValidators(Validators.required);
      }
    }

    this.control(start).updateValueAndValidity();
    this.control(end).updateValueAndValidity();
  }
}
