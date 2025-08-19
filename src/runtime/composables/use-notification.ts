import type { ToastMessageOptions, ToastServiceMethods } from 'primevue';
import { useToast } from 'primevue/usetoast';
import type { StatusLevel } from '../types';

const DefaultLifetime = 5000;

function createToastMessageOptions(
  message : string,
  status? : StatusLevel,
  config? : NotificationOptions,
): ToastMessageOptions {
  return {
    detail   : message,
    severity : status,
    summary  : config?.headline,
    closable : config?.closable === true,
    life     : config?.closable === true ? undefined : DefaultLifetime,
  };
}

function createToastMessageClosure(toast: ToastServiceMethods, status: undefined | StatusLevel) {
  const fn = (message: string, options?: NotificationOptions) => {
    toast.add(createToastMessageOptions(message, status, options));
  };

  Object.defineProperty(fn, 'name', {
    value: `notify${ status ?? '' }`,
  });

  return fn;
}


export type NotificationOptions = {
  headline? : string;
  closable? : boolean;
};

export type UseNotificationReturn = {
  notify        : (message: string, options?: NotificationOptions) => void;
  notifyInfo    : (message: string, options?: NotificationOptions) => void;
  notifyHelp    : (message: string, options?: NotificationOptions) => void;
  notifySuccess : (message: string, options?: NotificationOptions) => void;
  notifyWarning : (message: string, options?: NotificationOptions) => void;
  notifyError   : (message: string, options?: NotificationOptions) => void;
};


/**
 * Returns a collection of methods for providing user feedback via popup
 * notifications (a.k.a. toast notifications / snackbar notifications).
 */
export function useNotification(): UseNotificationReturn {
  const toast = useToast();

  return {
    notify        : createToastMessageClosure(toast, undefined),
    notifyInfo    : createToastMessageClosure(toast, 'info'),
    notifyHelp    : createToastMessageClosure(toast, 'help'),
    notifySuccess : createToastMessageClosure(toast, 'success'),
    notifyWarning : createToastMessageClosure(toast, 'warn'),
    notifyError   : createToastMessageClosure(toast, 'error'),
  };
}
