import { useState } from 'react';
import { TextField } from '@/components/ui/TextField';
import { Select } from '@/components/ui/Select';
import type { TicketStatus, TicketPriority, TicketFilters } from '../types/ticket.types';
import './TicketFilters.css';

interface TicketFiltersProps {
  filters: TicketFilters;
  onFiltersChange: (filters: TicketFilters) => void;
}

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'open', label: 'Open' },
  { value: 'pending', label: 'Pending' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
];

const priorityOptions = [
  { value: '', label: 'All Priorities' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
];

export function TicketFilters({ filters, onFiltersChange }: TicketFiltersProps) {
  const [search, setSearch] = useState(filters.search || '');

  const handleSearchChange = (value: string) => {
    setSearch(value);
    // Search will be debounced in the parent component
    onFiltersChange({ ...filters, search: value });
  };

  return (
    <div className="ticket-filters" role="search" aria-label="Filter tickets">
      <TextField
        label="Search tickets"
        type="search"
        value={search}
        onChange={(e) => handleSearchChange(e.target.value)}
        placeholder="Search by title or description..."
        hideLabel
        aria-label="Search tickets by title or description"
      />

      <Select
        label="Status"
        hideLabel
        options={statusOptions}
        value={filters.status || ''}
        onChange={(e) =>
          onFiltersChange({
            ...filters,
            status: e.target.value as TicketStatus | undefined,
          })
        }
        aria-label="Filter by status"
      />

      <Select
        label="Priority"
        hideLabel
        options={priorityOptions}
        value={filters.priority || ''}
        onChange={(e) =>
          onFiltersChange({
            ...filters,
            priority: e.target.value as TicketPriority | undefined,
          })
        }
        aria-label="Filter by priority"
      />

      <Select
        label="Sort by"
        hideLabel
        options={sortOptions}
        value={filters.sortBy || 'newest'}
        onChange={(e) =>
          onFiltersChange({
            ...filters,
            sortBy: e.target.value as 'newest' | 'oldest',
          })
        }
        aria-label="Sort tickets"
      />
    </div>
  );
}
