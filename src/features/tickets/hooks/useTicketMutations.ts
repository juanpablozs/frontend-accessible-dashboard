import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketsApi } from '../api/ticketsApi';
import { toast } from '@/components/ui/toast-api';
import type { CreateTicketInput, UpdateTicketStatusInput, AddNoteInput } from '../types/ticket.types';

export function useCreateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTicketInput) => ticketsApi.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast.success('Ticket created successfully');
    },
    onError: () => {
      toast.error('Failed to create ticket. Please try again.');
    },
  });
}

export function useUpdateTicketStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateTicketStatusInput) => ticketsApi.updateStatus(input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['tickets', variables.id] });
      toast.success('Ticket status updated');
    },
    onError: () => {
      toast.error('Failed to update ticket status');
    },
  });
}

export function useAddNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AddNoteInput) => ticketsApi.addNote(input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tickets', variables.ticketId] });
      toast.success('Note added successfully');
    },
    onError: () => {
      toast.error('Failed to add note');
    },
  });
}
