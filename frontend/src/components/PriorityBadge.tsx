import type { Priority } from '../types/ticket';

interface PriorityBadgeProps {
  priority: Priority;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <span className={`badge badge-priority badge-priority-${priority.toLowerCase()}`}>
      {priority}
    </span>
  );
}
