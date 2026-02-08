import { http, HttpResponse, delay } from 'msw';
import { db } from './db';

const API_DELAY = 300; // Simulate network latency

export const handlers = [
  // Get all tickets with filters
  http.get('/api/tickets', async ({ request }) => {
    await delay(API_DELAY);

    const url = new URL(request.url);
    const search = url.searchParams.get('search') || undefined;
    const status = url.searchParams.get('status') || undefined;
    const priority = url.searchParams.get('priority') || undefined;

    const tickets = db.ticket.findMany({ search, status, priority });

    return HttpResponse.json({ tickets });
  }),

  // Get single ticket
  http.get('/api/tickets/:id', async ({ params }) => {
    await delay(API_DELAY);

    const { id } = params;
    const ticket = db.ticket.findById(id as string);

    if (!ticket) {
      return HttpResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    return HttpResponse.json({ ticket });
  }),

  // Create ticket
  http.post('/api/tickets', async ({ request }) => {
    await delay(API_DELAY);

    const body = (await request.json()) as {
      title: string;
      description: string;
      priority: string;
      category: string;
    };

    const ticket = db.ticket.create(body);

    return HttpResponse.json({ ticket }, { status: 201 });
  }),

  // Update ticket status
  http.patch('/api/tickets/:id/status', async ({ params, request }) => {
    await delay(API_DELAY);

    const { id } = params;
    const body = (await request.json()) as { status: string };

    const ticket = db.ticket.updateStatus(id as string, body.status);

    if (!ticket) {
      return HttpResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    return HttpResponse.json({ ticket });
  }),

  // Add note to ticket
  http.post('/api/tickets/:id/notes', async ({ params, request }) => {
    await delay(API_DELAY);

    const { id } = params;
    const body = (await request.json()) as { content: string };

    const note = db.ticket.addNote(id as string, body.content);

    if (!note) {
      return HttpResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    return HttpResponse.json({ note }, { status: 201 });
  }),

  // Authentication
  http.post('/api/auth/login', async ({ request }) => {
    await delay(API_DELAY);

    const body = (await request.json()) as { username: string; password: string };

    const isValid = db.user.authenticate(body.username, body.password);

    if (!isValid) {
      return HttpResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    return HttpResponse.json({
      user: { id: '1', username: body.username },
      token: 'fake-jwt-token',
    });
  }),
];
