import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextField } from '@/components/ui/TextField';

describe('TextField Component', () => {
  it('renders with label', () => {
    render(<TextField label="Email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('shows error message when provided', () => {
    render(<TextField label="Email" error="Email is required" />);
    
    const input = screen.getByLabelText('Email');
    const error = screen.getByText('Email is required');

    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(error).toBeInTheDocument();
    expect(error).toHaveAttribute('role', 'alert');
  });

  it('links error message with aria-describedby', () => {
    render(<TextField label="Email" error="Email is required" />);
    
    const input = screen.getByLabelText('Email');
    const errorId = input.getAttribute('aria-describedby');
    const error = screen.getByText('Email is required');

    expect(errorId).toBeTruthy();
    expect(error).toHaveAttribute('id', errorId!);
  });

  it('shows helper text when provided', () => {
    render(<TextField label="Email" helperText="Enter your email address" />);
    
    const helper = screen.getByText('Enter your email address');
    const input = screen.getByLabelText('Email');
    const helperId = input.getAttribute('aria-describedby');

    expect(helper).toBeInTheDocument();
    expect(helper).toHaveAttribute('id', helperId!);
  });

  it('shows required indicator when required', () => {
    render(<TextField label="Email" required />);
    
    const input = screen.getByLabelText(/Email/);
    expect(input).toHaveAttribute('required');
    expect(screen.getByLabelText('required')).toBeInTheDocument();
  });

  it('handles user input', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    
    render(<TextField label="Email" onChange={handleChange} />);
    
    const input = screen.getByLabelText(/Email/);
    await user.type(input, 'test@example.com');

    expect(handleChange).toHaveBeenCalled();
    expect(input).toHaveValue('test@example.com');
  });

  it('can be disabled', () => {
    render(<TextField label="Email" disabled />);
    
    const input = screen.getByLabelText('Email');
    expect(input).toBeDisabled();
  });

  it('hides label visually when hideLabel is true', () => {
    render(<TextField label="Search" hideLabel />);
    
    const label = screen.getByText('Search');
    expect(label).toHaveClass('sr-only');
  });
});
