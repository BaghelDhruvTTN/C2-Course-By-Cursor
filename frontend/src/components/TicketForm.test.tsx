import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TicketForm } from './TicketForm';

describe('TicketForm', () => {
  it('renders fieldErrors from API validation response', () => {
    render(
      <TicketForm
        fieldErrors={{
          title: 'Title must not be blank',
          description: 'Description must not be blank',
          priority: 'Priority is required',
        }}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    expect(screen.getByText('Title must not be blank')).toBeInTheDocument();
    expect(screen.getByText('Description must not be blank')).toBeInTheDocument();
    expect(screen.getByText('Priority is required')).toBeInTheDocument();
    expect(screen.getByLabelText('Title')).toHaveClass('form-input-invalid');
  });
});
