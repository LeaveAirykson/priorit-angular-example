import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { Notification } from '../models/notification.class';

/**
 * This component shows notifications passed in from notification service.
 */
@Component({
  selector: 'app-notification-area',
  templateUrl: './notification-area.component.html',
  styleUrls: ['./notification-area.component.css']
})
export class NotificationAreaComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject();
  notifications: Notification[] = [];

  constructor(private service: NotificationService) { }

  ngOnInit(): void {
    this.service.notification
      .pipe(takeUntil(this.destroy$))
      .subscribe((notification) => this.add(notification));
  }

  /**
   * Adds a notification to the notification stack
   *
   * @param  {Notification} notification
   *
   * @return {void}
   */
  add(notification: Notification) {
    if (notification.options.clear) {
      this.notifications = [];
    }

    this.notifications.push(notification);

    // remove not with a delay if needed
    if (typeof notification.options.autoHide == 'number') {
      setTimeout(() => this.remove(notification.id), notification.options.autoHide * 1000);
    }
  }

  /**
   * Removes a notification from notification stack by its id
   *
   * @param  {string} id
   *
   * @return {void}
   */
  remove(id: string) {
    this.notifications = this.notifications.filter((f) => f.id !== id);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
