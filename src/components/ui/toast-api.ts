/**
 * Toast API for programmatic toast notifications
 * Separated from component for Fast Refresh compatibility
 */

export interface ToastOptions {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  role?: 'status' | 'alert';
}

export interface ToastItem extends Required<Omit<ToastOptions, 'duration'>> {
  id: string;
  duration: number;
}

type ToastListener = (toasts: ToastItem[]) => void;

class ToastManager {
  private toasts: ToastItem[] = [];
  private listeners: Set<ToastListener> = new Set();

  subscribe(listener: ToastListener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  show(options: ToastOptions) {
    const toast: ToastItem = {
      id: Math.random().toString(36).substring(2, 11),
      message: options.message,
      type: options.type || 'info',
      duration: options.duration || 5000,
      role: options.role || (options.type === 'error' ? 'alert' : 'status'),
    };

    this.toasts = [...this.toasts, toast];
    this.notify();

    if (toast.duration > 0) {
      setTimeout(() => this.dismiss(toast.id), toast.duration);
    }
  }

  dismiss(id: string) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.notify();
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.toasts));
  }

  getToasts() {
    return this.toasts;
  }
}

export const toastManager = new ToastManager();

export const toast = {
  success: (message: string, duration?: number) =>
    toastManager.show({ message, type: 'success', duration }),
  error: (message: string, duration?: number) =>
    toastManager.show({ message, type: 'error', duration }),
  info: (message: string, duration?: number) =>
    toastManager.show({ message, type: 'info', duration }),
  warning: (message: string, duration?: number) =>
    toastManager.show({ message, type: 'warning', duration }),
};
