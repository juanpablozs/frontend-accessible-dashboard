import { ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './Dialog.css';

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  description?: string;
}

export function Dialog({ isOpen, onClose, title, children, description }: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previouslyFocusedElement.current = document.activeElement as HTMLElement;

      // Focus the dialog
      dialogRef.current?.focus();

      // Prevent scroll on body
      document.body.style.overflow = 'hidden';

      // Handle Escape key
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleEscape);

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = '';

        // Restore focus
        previouslyFocusedElement.current?.focus();
      };
    }
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (!isOpen || !dialogRef.current) return;

    const dialog = dialogRef.current;
    const focusableElements = dialog.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable?.focus();
          e.preventDefault();
        }
      }
    };

    dialog.addEventListener('keydown', handleTab);

    return () => {
      dialog.removeEventListener('keydown', handleTab);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="dialog-overlay" role="presentation">
      <div
        ref={dialogRef}
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby={description ? 'dialog-description' : undefined}
        tabIndex={-1}
      >
        <div className="dialog-header">
          <h2 id="dialog-title" className="dialog-title">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="dialog-close"
            aria-label="Close dialog"
            type="button"
          >
            ✕
          </button>
        </div>

        {description && (
          <p id="dialog-description" className="dialog-description">
            {description}
          </p>
        )}

        <div className="dialog-content">{children}</div>
      </div>
    </div>,
    document.body
  );
}
