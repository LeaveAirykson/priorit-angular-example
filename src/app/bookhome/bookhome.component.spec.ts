import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookhomeComponent } from './bookhome.component';
import { BooklistComponent } from '../booklist/booklist.component';
import { ExampleoptionsComponent } from '../exampleoptions/exampleoptions.component';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';

describe('BookhomeComponent', () => {
  let component: BookhomeComponent;
  let fixture: ComponentFixture<BookhomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookhomeComponent, BooklistComponent, ExampleoptionsComponent],
      imports: [CommonModule, AppRoutingModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BookhomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
