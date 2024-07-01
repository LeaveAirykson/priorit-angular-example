import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExampleoptionsComponent } from './exampleoptions.component';

describe('ExampleoptionsComponent', () => {
  let component: ExampleoptionsComponent;
  let fixture: ComponentFixture<ExampleoptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExampleoptionsComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ExampleoptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
