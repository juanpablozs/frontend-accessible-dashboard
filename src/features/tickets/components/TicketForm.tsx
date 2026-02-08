import { useState, FormEvent, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField } from '@/components/ui/TextField';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { ToastContainer } from '@/components/ui/Toast';
import { useCreateTicket } from '../hooks/useTicketMutations';
import { ticketSchema } from '../schemas/ticketSchema';
import type { TicketPriority, TicketCategory } from '../types/ticket.types';
import './TicketForm.css';

const priorityOptions = [
  { value: '', label: 'Select priority' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

const categoryOptions = [
  { value: '', label: 'Select category' },
  { value: 'bug', label: 'Bug Report' },
  { value: 'feature', label: 'Feature Request' },
  { value: 'question', label: 'Question' },
  { value: 'documentation', label: 'Documentation' },
  { value: 'other', label: 'Other' },
];

export default function TicketForm() {
  const navigate = useNavigate();
  const createTicket = useCreateTicket();
  const errorSummaryRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: '' as TicketPriority | '',
    category: '' as TicketCategory | '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const validate = () => {
    try {
      ticketSchema.parse(formData);
      setErrors({});
      return true;
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'errors' in err) {
        const zodError = err as { errors: Array<{ path: string[]; message: string }> };
        const newErrors: Record<string, string> = {};
        zodError.errors.forEach((error) => {
          const field = error.path[0] as string;
          newErrors[field] = error.message;
        });
        setErrors(newErrors);
        return false;
      }
      return false;
    }
  };

  // Focus error summary when errors appear
  useEffect(() => {
    if (hasSubmitted && Object.keys(errors).length > 0) {
      errorSummaryRef.current?.focus();
    }
  }, [errors, hasSubmitted]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);

    if (!validate()) {
      // Find first invalid field and focus it
      const firstError = Object.keys(errors)[0];
      const firstErrorField = document.querySelector(
        `[name="${firstError}"]`
      ) as HTMLElement;
      firstErrorField?.focus();
      return;
    }

    createTicket.mutate(
      {
        title: formData.title,
        description: formData.description,
        priority: formData.priority as TicketPriority,
        category: formData.category as TicketCategory,
      },
      {
        onSuccess: () => {
          navigate('/tickets');
        },
      }
    );
  };

  const handleCancel = () => {
    navigate('/tickets');
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (hasSubmitted && errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const errorCount = Object.keys(errors).length;

  return (
    <div className="container ticket-form-page">
      <div className="ticket-form-header">
        <h1>Create New Ticket</h1>
        <p>Fill out the form below to submit a new support ticket.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="ticket-form">
        {hasSubmitted && errorCount > 0 && (
          <div
            ref={errorSummaryRef}
            className="error-summary"
            role="alert"
            aria-labelledby="error-summary-title"
            tabIndex={-1}
          >
            <h2 id="error-summary-title" className="error-summary-title">
              {errorCount} {errorCount === 1 ? 'Error' : 'Errors'} in form
            </h2>
            <p>Please correct the following errors:</p>
            <ul className="error-list">
              {Object.entries(errors).map(([field, message]) => (
                <li key={field}>
                  <a
                    href={`#${field}`}
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.querySelector(
                        `[name="${field}"]`
                      ) as HTMLElement;
                      element?.focus();
                    }}
                  >
                    {message}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <TextField
          id="title"
          name="title"
          label="Title"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          error={errors.title}
          required
          helperText="Provide a clear and concise title for your ticket"
        />

        <div className="form-field">
          <label htmlFor="description" className="form-label">
            Description
            <span className="required-indicator" aria-label="required">
              *
            </span>
          </label>
          <textarea
            id="description"
            name="description"
            className={`form-textarea ${errors.description ? 'form-textarea-error' : ''}`}
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={6}
            required
            aria-invalid={errors.description ? 'true' : 'false'}
            aria-describedby={
              errors.description ? 'description-error' : 'description-helper'
            }
          />
          {errors.description && (
            <p id="description-error" className="field-error" role="alert">
              {errors.description}
            </p>
          )}
          {!errors.description && (
            <p id="description-helper" className="field-helper">
              Describe your issue or request in detail
            </p>
          )}
        </div>

        <div className="form-row">
          <Select
            id="priority"
            name="priority"
            label="Priority"
            options={priorityOptions}
            value={formData.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
            error={errors.priority}
            required
            helperText="How urgent is this ticket?"
          />

          <Select
            id="category"
            name="category"
            label="Category"
            options={categoryOptions}
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            error={errors.category}
            required
            helperText="What type of issue is this?"
          />
        </div>

        <div className="form-actions">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={createTicket.isPending}
          >
            {createTicket.isPending ? 'Creating...' : 'Create Ticket'}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="lg"
            onClick={handleCancel}
            disabled={createTicket.isPending}
          >
            Cancel
          </Button>
        </div>
      </form>

      <ToastContainer />
    </div>
  );
}
