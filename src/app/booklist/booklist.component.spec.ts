import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooklistComponent } from './booklist.component';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('BooklistComponent', () => {
  let component: BooklistComponent;
  let fixture: ComponentFixture<BooklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BooklistComponent],
      imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule, CommonModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BooklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
