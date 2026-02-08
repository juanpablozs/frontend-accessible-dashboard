import './ErrorMessage.css';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ title = 'Error', message, onRetry }: ErrorMessageProps) {
  return (
    <div className="error-message" role="alert">
      <div className="error-icon" aria-hidden="true">
        ⚠
      </div>
      <div className="error-content">
        <h3 className="error-title">{title}</h3>
        <p className="error-text">{message}</p>
        {onRetry && (
          <button onClick={onRetry} className="error-retry" type="button">
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
