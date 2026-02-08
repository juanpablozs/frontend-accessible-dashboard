import type {
  Ticket,
  CreateTicketInput,
  UpdateTicketStatusInput,
  AddNoteInput,
  TicketFilters,
} from '../types/ticket.types';

export const ticketsApi = {
  getAll: async (filters?: TicketFilters): Promise<Ticket[]> => {
    const params = new URLSearchParams();

    if (filters?.search) params.append('search', filters.search);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);

    const response = await fetch(`/api/tickets?${params.toString()}`);

    if (!response.ok) {
      throw new Error('Failed to fetch tickets');
    }

    const data = await response.json();
    return data.tickets;
  },

  getById: async (id: string): Promise<Ticket> => {
    const response = await fetch(`/api/tickets/${id}`);

    if (!response.ok) {
      throw new Error('Failed to fetch ticket');
    }

    const data = await response.json();
    return data.ticket;
  },

  create: async (input: CreateTicketInput): Promise<Ticket> => {
    const response = await fetch('/api/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw new Error('Failed to create ticket');
    }

    const data = await response.json();
    return data.ticket;
  },

  updateStatus: async (input: UpdateTicketStatusInput): Promise<Ticket> => {
    const response = await fetch(`/api/tickets/${input.id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: input.status }),
    });

    if (!response.ok) {
      throw new Error('Failed to update ticket status');
    }

    const data = await response.json();
    return data.ticket;
  },

  addNote: async (input: AddNoteInput): Promise<void> => {
    const response = await fetch(`/api/tickets/${input.ticketId}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: input.content }),
    });

    if (!response.ok) {
      throw new Error('Failed to add note');
    }
  },
};
