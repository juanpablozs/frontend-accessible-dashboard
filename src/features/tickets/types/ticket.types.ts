export type TicketStatus = 'open' | 'pending' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketCategory = 'bug' | 'feature' | 'question' | 'documentation' | 'other';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  createdAt: string;
  updatedAt: string;
  notes: TicketNote[];
}

export interface TicketNote {
  id: string;
  ticketId: string;
  content: string;
  createdAt: string;
}

export interface CreateTicketInput {
  title: string;
  description: string;
  priority: TicketPriority;
  category: TicketCategory;
}

export interface UpdateTicketStatusInput {
  id: string;
  status: TicketStatus;
}

export interface AddNoteInput {
  ticketId: string;
  content: string;
}

export interface TicketFilters {
  search?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  sortBy?: 'newest' | 'oldest';
}
