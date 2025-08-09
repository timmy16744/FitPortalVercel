// Premium Lazy Loading Component with Enhanced Loading States
import React, { Suspense } from 'react';
import LoadingScreen from './LoadingScreen';

const LazyComponent = ({ 
  component: Component, 
  fallback, 
  errorBoundary = true,
  ...props 
}) => {
  // Lightweight loading fallback - minimal and fast
  const defaultFallback = <div className="p-4"></div>;

  const LoadingFallback = fallback || defaultFallback;

  if (errorBoundary) {
    return (
      <ErrorBoundary>
        <Suspense fallback={LoadingFallback}>
          <Component {...props} />
        </Suspense>
      </ErrorBoundary>
    );
  }

  return (
    <Suspense fallback={LoadingFallback}>
      <Component {...props} />
    </Suspense>
  );
};

// Premium Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('LazyComponent Error:', error, errorInfo);
    
    // In production, send to error reporting service
    if (process.env.NODE_ENV === 'production') {
      // reportError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="card-premium p-8 text-center animate-fade-in">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-error-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-error-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-primary mb-2">Something went wrong</h3>
            <p className="text-secondary mb-6">
              We're sorry, but this component failed to load. Please try refreshing the page.
            </p>
          </div>
          
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="btn-premium btn-premium--primary"
            >
              Refresh Page
            </button>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="btn-premium btn-premium--secondary"
            >
              Try Again
            </button>
          </div>
          
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-6 text-left bg-surface-secondary rounded-lg p-4">
              <summary className="cursor-pointer font-medium text-error-600 mb-2">
                Error Details (Development Only)
              </summary>
              <pre className="text-xs text-error-700 overflow-auto">
                {this.state.error?.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default LazyComponent;