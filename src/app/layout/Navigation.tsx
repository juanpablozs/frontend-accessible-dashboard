import { NavLink } from 'react-router-dom';
import './Navigation.css';

export function Navigation() {
  return (
    <nav aria-label="Main navigation">
      <ul className="nav-list">
        <li>
          <NavLink to="/tickets" className="nav-link">
            Tickets
          </NavLink>
        </li>
        <li>
          <NavLink to="/tickets/new" className="nav-link">
            New Ticket
          </NavLink>
        </li>
        <li>
          <NavLink to="/settings" className="nav-link">
            Settings
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
