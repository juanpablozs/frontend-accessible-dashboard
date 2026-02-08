import { useQuery } from '@tanstack/react-query';
import { ticketsApi } from '../api/ticketsApi';
import type { TicketFilters } from '../types/ticket.types';

export function useTickets(filters?: TicketFilters) {
  return useQuery({
    queryKey: ['tickets', filters],
    queryFn: () => ticketsApi.getAll(filters),
  });
}

export function useTicket(id: string) {
  return useQuery({
    queryKey: ['tickets', id],
    queryFn: () => ticketsApi.getById(id),
    enabled: !!id,
  });
}
