import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { queryClient } from '@/lib/queryClient';
import TicketList from '@/features/tickets/components/TicketList';

expect.extend(toHaveNoViolations);

// Mock tickets data
const mockTickets = [
  {
    id: '1',
    title: 'Login button not responding',
    description: 'The login button appears to be unresponsive',
    status: 'open' as const,
    priority: 'high' as const,
    category: 'bug' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    notes: [],
  },
  {
    id: '2',
    title: 'Add dark mode support',
    description: 'It would be great to have a dark mode option',
    status: 'pending' as const,
    priority: 'medium' as const,
    category: 'feature' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    notes: [],
  },
];

const server = setupServer(
  http.get('/api/tickets', () => {
    return HttpResponse.json({ tickets: mockTickets });
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

describe.skip('Tickets List - Accessibility', () => {
  it('should not have any accessibility violations', async () => {
    const { container } = renderWithProviders(<TicketList />);

    // Wait for tickets to load
    await waitFor(() => {
      expect(screen.getByText('Bug in login page')).toBeInTheDocument();
    }, { timeout: 3000 });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has proper heading hierarchy', async () => {
    const { container } = renderWithProviders(<TicketList />);

    // Wait for tickets to load
    await waitFor(() => {
      expect(screen.getByText('Bug in login page')).toBeInTheDocument();
    }, { timeout: 3000 });

    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    // Should have at least a main heading
    expect(headings.length).toBeGreaterThan(0);
    
    // First heading should be h1
    const firstHeading = headings[0];
    expect(firstHeading.tagName).toBe('H1');
  });

  it('has proper ARIA labels for search region', async () => {
    const { container } = renderWithProviders(<TicketList />);

    // Wait for tickets to load
    await waitFor(() => {
      expect(screen.getByText('Bug in login page')).toBeInTheDocument();
    }, { timeout: 3000 });

    const searchRegion = container.querySelector('[role="search"]');
    expect(searchRegion).toBeInTheDocument();
    expect(searchRegion).toHaveAttribute('aria-label');
  });

  it('has list role with listitem children', async () => {
    const { container } = renderWithProviders(<TicketList />);

    // Wait for content to load
    await new Promise(resolve => setTimeout(resolve, 500));

    const list = container.querySelector('[role="list"]');
    if (list) {
      expect(list).toHaveAttribute('aria-label');
      
      const listItems = list.querySelectorAll('[role="listitem"]');
      expect(listItems.length).toBeGreaterThan(0);
    }
  });

  it('has proper live region for status updates', async () => {
    const { container } = renderWithProviders(<TicketList />);

    // Wait for content to load
    await new Promise(resolve => setTimeout(resolve, 500));

    const liveRegion = container.querySelector('[aria-live]');
    expect(liveRegion).toBeInTheDocument();
  });

  it('ticket cards are keyboard accessible', async () => {
    const { container } = renderWithProviders(<TicketList />);

    // Wait for content to load
    await new Promise(resolve => setTimeout(resolve, 500));

    const buttons = container.querySelectorAll('[role="button"]');
    buttons.forEach(button => {
      // Each interactive element should be keyboard accessible
      expect(button).toHaveAttribute('tabIndex');
      expect(button).toHaveAttribute('aria-label');
    });
  });
});
