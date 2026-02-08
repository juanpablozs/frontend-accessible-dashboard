import './EmptyState.css';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon = '📭', title, description, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-icon" aria-hidden="true">
        {icon}
      </div>
      <h2 className="empty-title">{title}</h2>
      <p className="empty-description">{description}</p>
      {action && (
        <button onClick={action.onClick} className="empty-action" type="button">
          {action.label}
        </button>
      )}
    </div>
  );
}
