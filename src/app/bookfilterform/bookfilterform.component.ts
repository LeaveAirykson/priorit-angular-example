import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { validationPatterns } from '../utilities/book.validator';
import { Subject, takeUntil } from 'rxjs';
import { BookFilter } from '../interfaces/bookfilter.interface';

/**
 * This component shows a filter form for the booking data.
 * The form values can be prepopulated by passing supported values to the filter input.
 * It will output an update event on form submission with the form values as params.
 * On closing/canceling without submission a cancel event will be emitted.
 */
@Component({
  selector: 'app-bookfilterform',
  templateUrl: './bookfilterform.component.html',
  styleUrls: ['./bookfilterform.component.css']
})
export class BookfilterformComponent implements OnDestroy, OnChanges {
  @Output() update: EventEmitter<BookFilter> = new EventEmitter();
  @Output() cancel: EventEmitter<boolean> = new EventEmitter();
  @Input() filter: BookFilter | null = null;
  destroy$: Subject<boolean> = new Subject();
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

  /**
   * Resets form and emits cancel event.
   *
   * @return {void}
   */
  abort() {
    this.form.reset();
    this.cancel.emit(true);
  }

  /**
   * Emits update event with form values as params.
   *
   * @return {void}
   */
  submit() {
    this.update.emit(this.form.value);
  }
}
