import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../../app-routing.module';
import { BookListComponent } from './book-list.component';
import { BookChartComponent } from '../book-chart/book-chart.component';
import { SortableDirective } from '../../core/directives/sortable.directive';
import { SortbyDirective } from '../../core/directives/sortby.directive';

describe('BookListComponent', () => {
  let component: BookListComponent;
  let fixture: ComponentFixture<BookListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookListComponent, BookChartComponent, SortableDirective, SortbyDirective],
      imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule, CommonModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BookListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
