import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ErrorBanner } from './ErrorBanner';

describe('ErrorBanner', () => {
  it('renders message from error response', () => {
    render(<ErrorBanner message="Cannot transition from CLOSED to OPEN" />);

    expect(screen.getByRole('alert')).toHaveTextContent('Cannot transition from CLOSED to OPEN');
  });

  it('renders nothing when message is empty', () => {
    const { container } = render(<ErrorBanner message="" />);

    expect(container).toBeEmptyDOMElement();
  });
});
