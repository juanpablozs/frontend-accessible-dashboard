import { InputHTMLAttributes, forwardRef, useId } from 'react';
import { cn } from '@/lib/utils';
import './TextField.css';

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  hideLabel?: boolean;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, helperText, hideLabel, className, id: providedId, required, ...props }, ref) => {
    const generatedId = useId();
    const id = providedId || generatedId;
    const errorId = `${id}-error`;
    const helperId = `${id}-helper`;

    const describedBy = [
      error && errorId,
      helperText && !error && helperId,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className="text-field-wrapper">
        <label htmlFor={id} className={cn('text-field-label', hideLabel && 'sr-only')}>
          {label}
          {required && (
            <span className="required-indicator" aria-label="required">
              *
            </span>
          )}
        </label>

        <input
          ref={ref}
          id={id}
          className={cn('text-field-input', error && 'text-field-error', className)}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={describedBy || undefined}
          aria-required={required}
          required={required}
          {...props}
        />

        {error && (
          <p id={errorId} className="text-field-error-message" role="alert">
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id={helperId} className="text-field-helper">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

TextField.displayName = 'TextField';
