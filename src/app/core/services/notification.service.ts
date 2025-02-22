import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { NotificationOptions } from '../models/notification-options.interface';
import { NotificationType } from '../models/notification-type.interface';
import { Notification } from '../models/notification.class';

/**
 * Service to handle notifications
 */
@Injectable({
  providedIn: 'root'
})

export class NotificationService {

  private notifications = new Subject<Notification>();

  success(message: string, options?: NotificationOptions) {
    this.notify(message, 'success', options);
  }

  error(err: string | Error, options?: NotificationOptions) {
    if (err instanceof Error) {
      console.error(err);
    }

    options = options ?? { autoHide: false };

    this.notify(String(err), 'error', options);
  }

  info(message: string, options?: NotificationOptions) {
    this.notify(message, 'info', options);
  }

  warn(message: string, options?: NotificationOptions) {
    this.notify(message, 'warning', options);
  }

  private notify(message: string, type: NotificationType, options: NotificationOptions = {}) {
    this.notifications.next(new Notification(message, type, options));
  }

  get notification() {
    return this.notifications.asObservable();
  }
}
