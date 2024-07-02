import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { NotificationType, Notification, NotificationOptions } from '../interfaces/notification.interface';

@Injectable({
  providedIn: 'root'
})

export class NotificationService {

  private notifications = new Subject<Notification>();

  constructor() { }

  success(message: string, options?: NotificationOptions) {
    this.notify(message, 'success', options);
  }

  error(message: string, options?: NotificationOptions) {
    this.notify(message, 'error', options);
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
