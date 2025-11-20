import { isNumber } from '@resee-movies/utilities/numbers/is-number';
import type { ToastServiceMethods } from 'primevue/toastservice';
import { useToast } from 'primevue/usetoast';
import type { StatusLevel } from '../types';


export interface NotificationOptions {
  headline? : string;
  closable? : boolean;
  icon?     : string;
  lifetime? : number;
}


export class NotificationService {
  public readonly notify        : (message: string, options?: NotificationOptions & { severity?: StatusLevel }) => void;
  public readonly notifyInfo    : (message: string, options?: NotificationOptions) => void;
  public readonly notifyHelp    : (message: string, options?: NotificationOptions) => void;
  public readonly notifySuccess : (message: string, options?: NotificationOptions) => void;
  public readonly notifyWarning : (message: string, options?: NotificationOptions) => void;
  public readonly notifyError   : (message: string, options?: NotificationOptions) => void;


  constructor(toast: ToastServiceMethods) {
    this.notify = (message, options) => {
      toast.add({
        detail   : message,
        severity : options?.severity,
        summary  : options?.headline,
        closable : options?.closable === true,
        life     : isNumber(options?.lifetime) ? options?.lifetime : 5000,

        /* @ts-expect-error - adding custom props to extend functionality */
        icon: options?.icon,
      });
    };

    this.notifyInfo    = (message, options) => this.notify(message, { severity: 'info', ...options });
    this.notifyHelp    = (message, options) => this.notify(message, { severity: 'help', ...options });
    this.notifySuccess = (message, options) => this.notify(message, { severity: 'success', ...options });
    this.notifyWarning = (message, options) => this.notify(message, { severity: 'warn', ...options });
    this.notifyError   = (message, options) => this.notify(message, { severity: 'error', ...options });
  }
}


/**
 * Returns a collection of methods for providing user feedback via popup
 * notifications (a.k.a. toast notifications / snackbar notifications).
 */
export function useNotification(): NotificationService {
  return new NotificationService(useToast());
}
