import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookHomeComponent } from './book-home.component';
import { BookListComponent } from '../book-list/book-list.component';
import { DemoToolbarComponent } from '../demo-toolbar/demo-toolbar.component';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';

describe('BookHomeComponent', () => {
  let component: BookHomeComponent;
  let fixture: ComponentFixture<BookHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookHomeComponent, BookListComponent, DemoToolbarComponent],
      imports: [CommonModule, AppRoutingModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BookHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
