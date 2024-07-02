import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationareaComponent } from './notificationarea.component';

describe('NotificationareaComponent', () => {
  let component: NotificationareaComponent;
  let fixture: ComponentFixture<NotificationareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationareaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
