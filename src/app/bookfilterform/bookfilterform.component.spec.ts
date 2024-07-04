import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookfilterformComponent } from './bookfilterform.component';

describe('BookfilterformComponent', () => {
  let component: BookfilterformComponent;
  let fixture: ComponentFixture<BookfilterformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookfilterformComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookfilterformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
