import type { Ticket } from '../types/ticket.types';
import { formatDate } from '@/lib/utils';
import './TicketCard.css';

interface TicketCardProps {
  ticket: Ticket;
  onClick: () => void;
}

const priorityLabels = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

const statusLabels = {
  open: 'Open',
  pending: 'Pending',
  resolved: 'Resolved',
  closed: 'Closed',
};

export function TicketCard({ ticket, onClick }: TicketCardProps) {
  return (
    <div
      className="ticket-card"
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`View ticket: ${ticket.title}`}
    >
      <div className="ticket-card-header">
        <h3 className="ticket-card-title">{ticket.title}</h3>
        <span className={`status-badge status-${ticket.status}`} aria-label={`Status: ${statusLabels[ticket.status]}`}>
          <span className="status-indicator" aria-hidden="true"></span>
          {statusLabels[ticket.status]}
        </span>
      </div>

      <p className="ticket-card-description">{ticket.description}</p>

      <div className="ticket-card-meta">
        <span className={`priority-badge priority-${ticket.priority}`}>
          <span className="sr-only">Priority: </span>
          {priorityLabels[ticket.priority]}
        </span>
        <span className="ticket-card-date">
          <span className="sr-only">Created: </span>
          {formatDate(ticket.createdAt)}
        </span>
      </div>
    </div>
  );
}
