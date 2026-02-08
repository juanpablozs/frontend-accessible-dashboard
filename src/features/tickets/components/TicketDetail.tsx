import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTicket } from '../hooks/useTickets';
import { useUpdateTicketStatus, useAddNote } from '../hooks/useTicketMutations';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { ToastContainer } from '@/components/ui/Toast';
import { formatDate } from '@/lib/utils';
import type { TicketStatus } from '../types/ticket.types';
import './TicketDetail.css';

const statusOptions = [
  { value: 'open', label: 'Open' },
  { value: 'pending', label: 'Pending' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
];

const priorityLabels = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

const categoryLabels = {
  bug: 'Bug Report',
  feature: 'Feature Request',
  question: 'Question',
  documentation: 'Documentation',
  other: 'Other',
};

export default function TicketDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: ticket, isLoading, isError, error, refetch } = useTicket(id!);
  const updateStatus = useUpdateTicketStatus();
  const addNote = useAddNote();

  const [newStatus, setNewStatus] = useState<TicketStatus | ''>('');
  const [noteContent, setNoteContent] = useState('');
  const [noteError, setNoteError] = useState('');

  const handleStatusUpdate = () => {
    if (!newStatus || !ticket) return;

    updateStatus.mutate(
      {
        id: ticket.id,
        status: newStatus,
      },
      {
        onSuccess: () => {
          setNewStatus('');
        },
      }
    );
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();

    if (!noteContent.trim()) {
      setNoteError('Note content cannot be empty');
      return;
    }

    if (!ticket) return;

    addNote.mutate(
      {
        ticketId: ticket.id,
        content: noteContent,
      },
      {
        onSuccess: () => {
          setNoteContent('');
          setNoteError('');
          refetch();
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="container ticket-detail-page">
        <LoadingSkeleton count={5} height="80px" />
      </div>
    );
  }

  if (isError || !ticket) {
    return (
      <div className="container ticket-detail-page">
        <ErrorMessage
          title="Failed to load ticket"
          message={error instanceof Error ? error.message : 'Ticket not found'}
          onRetry={refetch}
        />
        <Button onClick={() => navigate('/tickets')} variant="ghost">
          Back to Tickets
        </Button>
      </div>
    );
  }

  return (
    <div className="container ticket-detail-page">
      <div className="ticket-detail-header">
        <Button
          onClick={() => navigate('/tickets')}
          variant="ghost"
          aria-label="Back to tickets list"
        >
          ← Back to Tickets
        </Button>
      </div>

      <article className="ticket-detail" aria-labelledby="ticket-title">
        <div className="ticket-detail-main">
          <div className="ticket-meta-badges">
            <span className={`status-badge status-${ticket.status}`}>
              <span className="status-indicator" aria-hidden="true"></span>
              {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
            </span>
            <span className={`priority-badge priority-${ticket.priority}`}>
              Priority: {priorityLabels[ticket.priority]}
            </span>
            <span className="category-badge">
              {categoryLabels[ticket.category]}
            </span>
          </div>

          <h1 id="ticket-title" className="ticket-title">
            {ticket.title}
          </h1>

          <div className="ticket-meta-info">
            <span>Created: {formatDate(ticket.createdAt)}</span>
            <span>Updated: {formatDate(ticket.updatedAt)}</span>
          </div>

          <div className="ticket-description">
            <h2>Description</h2>
            <p>{ticket.description}</p>
          </div>

          {ticket.notes.length > 0 && (
            <div className="ticket-notes">
              <h2>Notes ({ticket.notes.length})</h2>
              <ul className="notes-list">
                {ticket.notes.map((note) => (
                  <li key={note.id} className="note-item">
                    <div className="note-content">{note.content}</div>
                    <div className="note-meta">{formatDate(note.createdAt)}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleAddNote} className="add-note-form">
            <h2>Add Internal Note</h2>
            <div className="form-field">
              <label htmlFor="note-content" className="sr-only">
                Note content
              </label>
              <textarea
                id="note-content"
                className={`form-textarea ${noteError ? 'form-textarea-error' : ''}`}
                value={noteContent}
                onChange={(e) => {
                  setNoteContent(e.target.value);
                  setNoteError('');
                }}
                rows={4}
                placeholder="Add a note about this ticket..."
                aria-invalid={noteError ? 'true' : 'false'}
                aria-describedby={noteError ? 'note-error' : undefined}
              />
              {noteError && (
                <p id="note-error" className="field-error" role="alert">
                  {noteError}
                </p>
              )}
            </div>
            <Button
              type="submit"
              variant="secondary"
              isLoading={addNote.isPending}
            >
              {addNote.isPending ? 'Adding...' : 'Add Note'}
            </Button>
          </form>
        </div>

        <aside className="ticket-detail-sidebar" aria-label="Ticket actions">
          <div className="sidebar-section">
            <h2>Update Status</h2>
            <p className="sidebar-description">
              Current status: <strong>{ticket.status}</strong>
            </p>
            <Select
              label="New status"
              hideLabel
              options={statusOptions}
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as TicketStatus)}
              aria-label="Select new status"
            />
            <Button
              onClick={handleStatusUpdate}
              variant="primary"
              isLoading={updateStatus.isPending}
              disabled={!newStatus || newStatus === ticket.status}
            >
              {updateStatus.isPending ? 'Updating...' : 'Update Status'}
            </Button>
          </div>

          <div className="sidebar-section">
            <h2>Ticket Information</h2>
            <dl className="info-list">
              <dt>ID</dt>
              <dd>{ticket.id}</dd>
              <dt>Priority</dt>
              <dd>{priorityLabels[ticket.priority]}</dd>
              <dt>Category</dt>
              <dd>{categoryLabels[ticket.category]}</dd>
              <dt>Created</dt>
              <dd>{formatDate(ticket.createdAt)}</dd>
              <dt>Last Updated</dt>
              <dd>{formatDate(ticket.updatedAt)}</dd>
            </dl>
          </div>
        </aside>
      </article>

      <ToastContainer />
    </div>
  );
}
