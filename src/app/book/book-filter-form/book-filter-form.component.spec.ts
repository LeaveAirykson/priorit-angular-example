import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookFilterFormComponent } from './book-filter-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('BookFilterFormComponent', () => {
  let component: BookFilterFormComponent;
  let fixture: ComponentFixture<BookFilterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookFilterFormComponent],
      imports: [ReactiveFormsModule, FormsModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BookFilterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
