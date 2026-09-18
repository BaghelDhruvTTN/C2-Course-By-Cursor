import { Link, Outlet } from 'react-router-dom';

export function AppLayout() {
  return (
    <div className="app-layout">
      <header className="app-header">
        <Link to="/" className="app-title">Support Tickets</Link>
        <nav>
          <Link to="/tickets/new" className="button button-primary">New Ticket</Link>
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
