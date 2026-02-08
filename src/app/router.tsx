import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from './layout/MainLayout';

// Lazy load pages for better performance
import { lazy } from 'react';

const LoginPage = lazy(() => import('@/features/auth/components/LoginForm'));
const TicketListPage = lazy(() => import('@/features/tickets/components/TicketList'));
const TicketFormPage = lazy(() => import('@/features/tickets/components/TicketForm'));
const TicketDetailPage = lazy(() => import('@/features/tickets/components/TicketDetail'));
const SettingsPage = lazy(() => import('@/features/settings/components/SettingsPage'));

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/tickets" replace />,
      },
      {
        path: 'tickets',
        element: <TicketListPage />,
      },
      {
        path: 'tickets/new',
        element: <TicketFormPage />,
      },
      {
        path: 'tickets/:id',
        element: <TicketDetailPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: '*',
        element: (
          <div role="main" className="container" style={{ padding: '2rem' }}>
            <h1>404 - Page Not Found</h1>
            <p>The page you're looking for doesn't exist.</p>
            <a href="/tickets">Go back to tickets</a>
          </div>
        ),
      },
    ],
  },
]);
