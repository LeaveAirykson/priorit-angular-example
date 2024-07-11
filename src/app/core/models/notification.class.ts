import { NotificationOptions } from './notification-options.interface';
import { NotificationType } from './notification-type.interface';

export class Notification {
  id: string;
  message: string;
  type: NotificationType;
  options: NotificationOptions = {
    autoHide: 4,
    keepAfterRouteChange: false,
    clear: false
  };

  constructor(message: string, type: NotificationType, options: NotificationOptions) {
    this.id = 'alert_' + Math.random().toString(16).slice(2);
    this.message = message;
    this.type = type;
    this.options = { ...this.options, ...options };
  }
}
