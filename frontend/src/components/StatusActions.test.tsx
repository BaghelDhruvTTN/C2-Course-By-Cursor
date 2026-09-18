import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { StatusActions } from './StatusActions';

describe('StatusActions', () => {
  it('shows correct buttons for OPEN status', () => {
    render(<StatusActions status="OPEN" onTransition={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'Start Progress' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('shows correct buttons for IN_PROGRESS status', () => {
    render(<StatusActions status="IN_PROGRESS" onTransition={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'Mark Resolved' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('shows Close button for RESOLVED status', () => {
    render(<StatusActions status="RESOLVED" onTransition={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it('renders no buttons for terminal CLOSED status', () => {
    const { container } = render(<StatusActions status="CLOSED" onTransition={vi.fn()} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('calls onTransition with target status when button clicked', async () => {
    const user = userEvent.setup();
    const onTransition = vi.fn();

    render(<StatusActions status="OPEN" onTransition={onTransition} />);
    await user.click(screen.getByRole('button', { name: 'Start Progress' }));

    expect(onTransition).toHaveBeenCalledWith('IN_PROGRESS');
  });

  it('displays error alert on failed transition', () => {
    render(
      <StatusActions
        status="OPEN"
        error="Cannot transition from CLOSED to OPEN"
        onTransition={vi.fn()}
      />
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Cannot transition from CLOSED to OPEN');
  });
});
