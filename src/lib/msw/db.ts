import { generateId } from '@/lib/utils';
import type { Ticket, TicketNote } from '@/features/tickets/types/ticket.types';

// In-memory database
let tickets: Ticket[] = [
  {
    id: '1',
    title: 'Login button not responding on mobile',
    description:
      'The login button appears to be unresponsive when tapped on iOS Safari. Works fine on desktop browsers.',
    status: 'open',
    priority: 'high',
    category: 'bug',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    notes: [],
  },
  {
    id: '2',
    title: 'Add dark mode support',
    description:
      'It would be great to have a dark mode option for users who prefer it or work in low-light environments.',
    status: 'pending',
    priority: 'medium',
    category: 'feature',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    notes: [
      {
        id: 'note-1',
        ticketId: '2',
        content: 'Investigating the best approach for theme switching.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
      },
    ],
  },
  {
    id: '3',
    title: 'How to reset password?',
    description: 'I cannot find the password reset option in the settings page.',
    status: 'resolved',
    priority: 'low',
    category: 'question',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
    notes: [
      {
        id: 'note-2',
        ticketId: '3',
        content:
          'The password reset link is available on the login page, under the password field.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
      },
    ],
  },
];

export const db = {
  ticket: {
    findMany: (filters?: {
      search?: string;
      status?: string;
      priority?: string;
    }): Ticket[] => {
      let filtered = [...tickets];

      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(
          (t) =>
            t.title.toLowerCase().includes(searchLower) ||
            t.description.toLowerCase().includes(searchLower)
        );
      }

      if (filters?.status) {
        filtered = filtered.filter((t) => t.status === filters.status);
      }

      if (filters?.priority) {
        filtered = filtered.filter((t) => t.priority === filters.priority);
      }

      return filtered;
    },

    findById: (id: string): Ticket | undefined => {
      return tickets.find((t) => t.id === id);
    },

    create: (data: {
      title: string;
      description: string;
      priority: string;
      category: string;
    }): Ticket => {
      const newTicket: Ticket = {
        id: generateId(),
        title: data.title,
        description: data.description,
        status: 'open',
        priority: data.priority as Ticket['priority'],
        category: data.category as Ticket['category'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        notes: [],
      };
      tickets.push(newTicket);
      return newTicket;
    },

    updateStatus: (id: string, status: string): Ticket | null => {
      const ticket = tickets.find((t) => t.id === id);
      if (!ticket) return null;
      ticket.status = status as Ticket['status'];
      ticket.updatedAt = new Date().toISOString();
      return ticket;
    },

    addNote: (ticketId: string, content: string): TicketNote | null => {
      const ticket = tickets.find((t) => t.id === ticketId);
      if (!ticket) return null;

      const note: TicketNote = {
        id: generateId(),
        ticketId,
        content,
        createdAt: new Date().toISOString(),
      };

      ticket.notes.push(note);
      ticket.updatedAt = new Date().toISOString();
      return note;
    },

    deleteAll: (): void => {
      tickets = [];
    },
  },

  user: {
    authenticate: (username: string, password: string): boolean => {
      // Fake authentication: any non-empty username/password
      return username.length > 0 && password.length > 0;
    },
  },
};
