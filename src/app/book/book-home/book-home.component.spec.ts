import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppRoutingModule } from '../../app-routing.module';
import { BookChartComponent } from '../book-chart/book-chart.component';
import { BookListComponent } from '../book-list/book-list.component';
import { BookHomeComponent } from './book-home.component';
import { DemoToolbarComponent } from '../../core/demo-toolbar/demo-toolbar.component';
import { SortableDirective } from '../../core/directives/sortable.directive';

describe('BookHomeComponent', () => {
  let component: BookHomeComponent;
  let fixture: ComponentFixture<BookHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        BookHomeComponent,
        BookChartComponent,
        BookListComponent,
        DemoToolbarComponent,
        SortableDirective],
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
