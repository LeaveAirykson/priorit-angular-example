import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookformComponent } from './bookform.component';
import { RemunerationPipe } from '../pipes/remuneration.pipe';
import { ReactiveFormsModule } from '@angular/forms';

describe('BookformComponent', () => {
  let component: BookformComponent;
  let fixture: ComponentFixture<BookformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookformComponent, RemunerationPipe],
      imports: [ReactiveFormsModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BookformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
