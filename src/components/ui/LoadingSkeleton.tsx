import './LoadingSkeleton.css';

interface LoadingSkeletonProps {
  count?: number;
  height?: string;
  className?: string;
}

export function LoadingSkeleton({ count = 1, height = '60px', className = '' }: LoadingSkeletonProps) {
  return (
    <div className={`skeleton-container ${className}`} aria-live="polite" aria-busy="true">
      <span className="sr-only">Loading content...</span>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="loading-skeleton"
          style={{ height }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
