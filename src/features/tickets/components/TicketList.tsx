import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTickets } from '../hooks/useTickets';
import { TicketFilters } from './TicketFilters';
import { TicketCard } from './TicketCard';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/ui/Button';
import { ToastContainer } from '@/components/ui/Toast';
import { useDebounce } from '@/hooks/useDebounce';
import type { TicketFilters as TFilters } from '../types/ticket.types';
import './TicketList.css';

export default function TicketList() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<TFilters>({
    search: '',
    sortBy: 'newest',
  });

  // Debounce search to avoid too many API calls
  const debouncedSearch = useDebounce(filters.search, 300);
  const apiFilters = { ...filters, search: debouncedSearch };

  const { data: tickets, isLoading, isError, error, refetch } = useTickets(apiFilters);

  // Sort tickets
  const sortedTickets = useMemo(() => {
    if (!tickets) return [];

    const sorted = [...tickets];

    if (filters.sortBy === 'newest') {
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }

    return sorted;
  }, [tickets, filters.sortBy]);

  const handleTicketClick = (id: string) => {
    navigate(`/tickets/${id}`);
  };

  return (
    <div className="container ticket-list-page">
      <div className="ticket-list-header">
        <h1>Support Tickets</h1>
        <Button
          onClick={() => navigate('/tickets/new')}
          variant="primary"
          aria-label="Create new ticket"
        >
          New Ticket
        </Button>
      </div>

      <TicketFilters filters={filters} onFiltersChange={setFilters} />

      {isLoading && (
        <div aria-live="polite" aria-busy="true">
          <span className="sr-only">Loading tickets...</span>
          <LoadingSkeleton count={3} height="120px" />
        </div>
      )}

      {isError && (
        <ErrorMessage
          title="Failed to load tickets"
          message={error instanceof Error ? error.message : 'An error occurred'}
          onRetry={refetch}
        />
      )}

      {!isLoading && !isError && sortedTickets.length === 0 && (
        <EmptyState
          icon="🎫"
          title="No tickets found"
          description={
            filters.search || filters.status || filters.priority
              ? 'Try adjusting your filters to see more results.'
              : 'Get started by creating your first support ticket.'
          }
          action={{
            label: 'Create New Ticket',
            onClick: () => navigate('/tickets/new'),
          }}
        />
      )}

      {!isLoading && !isError && sortedTickets.length > 0 && (
        <>
          <div
            className="tickets-count"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            Showing {sortedTickets.length} {sortedTickets.length === 1 ? 'ticket' : 'tickets'}
          </div>

          <div className="ticket-list" role="list" aria-label="Tickets">
            {sortedTickets.map((ticket) => (
              <div key={ticket.id} role="listitem">
                <TicketCard ticket={ticket} onClick={() => handleTicketClick(ticket.id)} />
              </div>
            ))}
          </div>
        </>
      )}

      <ToastContainer />
    </div>
  );
}
