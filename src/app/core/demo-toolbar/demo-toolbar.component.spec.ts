import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoToolbarComponent } from './demo-toolbar.component';

describe('DemoToolbarComponent', () => {
  let component: DemoToolbarComponent;
  let fixture: ComponentFixture<DemoToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DemoToolbarComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DemoToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
