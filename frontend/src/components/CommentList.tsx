import type { CommentResponse } from '../types/ticket';

interface CommentListProps {
  comments: CommentResponse[];
}

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return <p className="comments-empty">No comments yet.</p>;
  }

  return (
    <ul className="comment-list">
      {comments.map((comment) => (
        <li key={comment.id} className="comment-item">
          <div className="comment-meta">
            <span className="comment-author">{comment.author}</span>
            <time className="comment-date" dateTime={comment.createdAt}>
              {formatDateTime(comment.createdAt)}
            </time>
          </div>
          <p className="comment-body">{comment.body}</p>
        </li>
      ))}
    </ul>
  );
}
