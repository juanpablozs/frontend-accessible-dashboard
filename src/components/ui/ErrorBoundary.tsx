import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div
            role="alert"
            style={{
              padding: '2rem',
              maxWidth: '600px',
              margin: '2rem auto',
              backgroundColor: 'var(--color-error-light)',
              border: '2px solid var(--color-error)',
              borderRadius: 'var(--border-radius)',
            }}
          >
            <h1 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: '1rem' }}>
              Something went wrong
            </h1>
            <p style={{ marginBottom: '1rem' }}>
              An unexpected error occurred. Please refresh the page to try again.
            </p>
            {this.state.error && (
              <details style={{ marginTop: '1rem' }}>
                <summary style={{ cursor: 'pointer', fontWeight: 600 }}>Error details</summary>
                <pre
                  style={{
                    marginTop: '0.5rem',
                    padding: '1rem',
                    backgroundColor: 'white',
                    borderRadius: '4px',
                    overflow: 'auto',
                  }}
                >
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--border-radius)',
                cursor: 'pointer',
                fontSize: 'var(--font-size-base)',
              }}
            >
              Refresh page
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
