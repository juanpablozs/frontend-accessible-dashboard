import { SelectHTMLAttributes, forwardRef, useId } from 'react';
import { cn } from '@/lib/utils';
import './Select.css';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
  hideLabel?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      options,
      error,
      helperText,
      hideLabel,
      className,
      id: providedId,
      required,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = providedId || generatedId;
    const errorId = `${id}-error`;
    const helperId = `${id}-helper`;

    const describedBy = [error && errorId, helperText && !error && helperId]
      .filter(Boolean)
      .join(' ');

    return (
      <div className="select-wrapper">
        <label htmlFor={id} className={cn('select-label', hideLabel && 'sr-only')}>
          {label}
          {required && (
            <span className="required-indicator" aria-label="required">
              *
            </span>
          )}
        </label>

        <select
          ref={ref}
          id={id}
          className={cn('select-input', error && 'select-error', className)}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={describedBy || undefined}
          aria-required={required}
          required={required}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {error && (
          <p id={errorId} className="select-error-message" role="alert">
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id={helperId} className="select-helper">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
