import { InputHTMLAttributes, forwardRef, useId } from 'react';
import { cn } from '@/lib/utils';
import './Checkbox.css';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  helperText?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, helperText, className, id: providedId, ...props }, ref) => {
    const generatedId = useId();
    const id = providedId || generatedId;
    const helperId = `${id}-helper`;

    return (
      <div className="checkbox-wrapper">
        <div className="checkbox-control">
          <input
            ref={ref}
            type="checkbox"
            id={id}
            className={cn('checkbox-input', className)}
            aria-describedby={helperText ? helperId : undefined}
            {...props}
          />
          <label htmlFor={id} className="checkbox-label">
            {label}
          </label>
        </div>

        {helperText && (
          <p id={helperId} className="checkbox-helper">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
