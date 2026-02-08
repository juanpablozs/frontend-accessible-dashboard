import { z } from 'zod';

export const ticketSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must not exceed 100 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must not exceed 1000 characters'),
  priority: z.enum(['low', 'medium', 'high', 'urgent'], {
    errorMap: () => ({ message: 'Please select a valid priority' }),
  }),
  category: z.enum(['bug', 'feature', 'question', 'documentation', 'other'], {
    errorMap: () => ({ message: 'Please select a valid category' }),
  }),
});

export type TicketFormData = z.infer<typeof ticketSchema>;
