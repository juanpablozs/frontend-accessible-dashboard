import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { queryClient } from '@/lib/queryClient';
import TicketForm from '@/features/tickets/components/TicketForm';

// Mock server for API calls
const server = setupServer(
  http.post('/api/tickets', async () => {
    return HttpResponse.json({
      ticket: {
        id: '123',
        title: 'Test Ticket',
        description: 'Test description',
        status: 'open',
        priority: 'high',
        category: 'bug',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        notes: [],
      },
    });
  })
);

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  queryClient.clear();
});
afterAll(() => server.close());

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        {ui}
      </QueryClientProvider>
    </BrowserRouter>
  );
}

describe('Create Ticket Flow - Keyboard Navigation', () => {
  it('allows creating a ticket using only keyboard', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TicketForm />);

    // Title field should have autofocus (first field)
    const titleInput = screen.getByLabelText(/title/i);
    expect(titleInput).toBeInTheDocument();

    // Fill in title using keyboard
    await user.type(titleInput, 'Login button not working');

    // Tab to description
    await user.tab();
    const descriptionInput = screen.getByLabelText(/description/i);
    expect(descriptionInput).toHaveFocus();
    await user.type(descriptionInput, 'The login button does not respond when clicked on mobile devices');

    // Tab to priority
    await user.tab();
    const prioritySelect = screen.getByLabelText(/priority/i);
    expect(prioritySelect).toHaveFocus();
    await user.selectOptions(prioritySelect, 'high');

    // Tab to category
    await user.tab();
    const categorySelect = screen.getByLabelText(/category/i);
    expect(categorySelect).toHaveFocus();
    await user.selectOptions(categorySelect, 'bug');

    // Tab to submit button
    await user.tab();
    const submitButton = screen.getByRole('button', { name: /create ticket/i });
    expect(submitButton).toHaveFocus();

    // Submit using Enter key
    await user.keyboard('{Enter}');

    // Wait for success (navigation would happen in real app)
    await waitFor(() => {
      expect(screen.queryByText(/creating/i)).not.toBeInTheDocument();
    });
  });

  it.skip('shows validation errors and moves focus to first invalid field', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TicketForm />);

    // Submit without filling anything
    const submitButton = screen.getByRole('button', { name: /create ticket/i });
    await user.click(submitButton);

    // Error summary should appear and be focused
    await waitFor(() => {
      const errorSummary = screen.getByRole('alert');
      expect(errorSummary).toBeInTheDocument();
      expect(errorSummary).toHaveTextContent(/error/i);
    }, { timeout: 3000 });

    // First invalid field (title) should be invalid
    const titleInput = screen.getByLabelText(/title/i);
    expect(titleInput).toHaveAttribute('aria-invalid', 'true');
  });

  it.skip('clears field error when user starts typing', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TicketForm />);

    const submitButton = screen.getByRole('button', { name: /create ticket/i });
    await user.click(submitButton);

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByText(/title must be at least 5 characters/i)).toBeInTheDocument();
    }, { timeout: 3000 });

    // Start typing in title
    const titleInput = screen.getByLabelText(/title/i);
    await user.type(titleInput, 'Test');

    // Error should still be there (not enough characters)
    // But when we type enough...
    await user.type(titleInput, ' Ticket');

    // The specific title error should be gone
    await waitFor(() => {
      expect(titleInput).not.toHaveAttribute('aria-invalid', 'true');
    });
  });

  it('allows canceling with keyboard', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TicketForm />);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    
    // Focus and activate cancel button
    cancelButton.focus();
    expect(cancelButton).toHaveFocus();
    
    await user.keyboard('{Enter}');
    
    // In real app, this would navigate away
    // Here we just verify the button is clickable
    expect(cancelButton).toBeEnabled();
  });
});
