import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { Subject, takeUntil } from 'rxjs';
import { Notification } from '../interfaces/notification.interface';

@Component({
  selector: 'app-notificationarea',
  templateUrl: './notificationarea.component.html',
  styleUrls: ['./notificationarea.component.css']
})
export class NotificationareaComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject();
  notifications: Notification[] = [];

  constructor(private service: NotificationService) { }

  ngOnInit(): void {
    this.service.notification
      .pipe(takeUntil(this.destroy$))
      .subscribe((notification) => this.add(notification));
  }

  add(notification: Notification) {
    if (notification.options.clear) {
      this.notifications = [];
    }

    this.notifications.push(notification);

    if (typeof notification.options.autoHide == 'number') {
      setTimeout(() => this.remove(notification.id), notification.options.autoHide * 1000);
    }
  }

  remove(id: string) {
    this.notifications = this.notifications.filter((f) => f.id !== id);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
