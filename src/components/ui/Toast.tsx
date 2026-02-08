import { useEffect, useState, useCallback } from 'react';
import { toastManager, type ToastItem } from './toast-api';
import './Toast.css';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  id: string;
  message: string;
  type?: ToastType;
  duration?: number;
  role?: 'status' | 'alert';
  onClose: (id: string) => void;
}

export function Toast({
  id,
  message,
  type = 'info',
  duration = 5000,
  role = 'status',
  onClose,
}: ToastProps) {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(id);
    }, 200);
  }, [id, onClose]);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, handleClose]);

  const getTypeLabel = () => {
    const labels = {
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      info: 'Information',
    };
    return labels[type];
  };

  return (
    <div
      className={`toast toast-${type} ${isExiting ? 'toast-exiting' : ''}`}
      role={role}
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      aria-atomic="true"
    >
      <div className="toast-content">
        <span className="toast-icon" aria-hidden="true">
          {type === 'success' && '✓'}
          {type === 'error' && '✕'}
          {type === 'warning' && '⚠'}
          {type === 'info' && 'ℹ'}
        </span>
        <div className="toast-message">
          <span className="sr-only">{getTypeLabel()}: </span>
          {message}
        </div>
      </div>
      <button
        onClick={handleClose}
        className="toast-close"
        aria-label="Close notification"
        type="button"
      >
        ✕
      </button>
    </div>
  );
}

// Toast Container with subscription to toast manager
export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const unsubscribe = toastManager.subscribe(setToasts);
    return unsubscribe;
  }, []);

  const handleClose = useCallback((id: string) => {
    toastManager.dismiss(id);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-label="Notifications">
      {toasts.map((t) => (
        <Toast key={t.id} {...t} onClose={handleClose} />
      ))}
    </div>
  );
}
