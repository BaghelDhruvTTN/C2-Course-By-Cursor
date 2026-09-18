import type { TicketStatus } from '../types/ticket';

const STATUS_OPTIONS: { value: '' | TicketStatus; label: string }[] = [
  { value: '', label: 'All statuses' },
  { value: 'OPEN', label: 'Open' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'RESOLVED', label: 'Resolved' },
  { value: 'CLOSED', label: 'Closed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

interface StatusFilterProps {
  value: TicketStatus | '';
  onChange: (status: TicketStatus | '') => void;
}

export function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <select
      className="status-filter"
      value={value}
      onChange={(event) => onChange(event.target.value as TicketStatus | '')}
      aria-label="Filter by status"
    >
      {STATUS_OPTIONS.map((option) => (
        <option key={option.value || 'all'} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
