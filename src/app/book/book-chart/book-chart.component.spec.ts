import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookChartComponent } from './book-chart.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('BookChartComponent', () => {
  let component: BookChartComponent;
  let fixture: ComponentFixture<BookChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookChartComponent],
      imports: [RouterTestingModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BookChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
