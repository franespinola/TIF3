import React from 'react';

//para manejar el error del resize observer loop
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Filter out ResizeObserver errors
    if (error.message && error.message.includes('ResizeObserver loop')) {
      // Don't update state for ResizeObserver errors
      return { hasError: false };
    }
    // Update state for other errors
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Filter ResizeObserver errors
    if (error.message && error.message.includes('ResizeObserver loop')) {
      console.warn('ResizeObserver error suppressed:', error.message);
    } else {
      // Log other errors
      console.error('Error caught by ErrorBoundary:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      // You can render any fallback UI
      return this.props.fallback || <h3>Something went wrong. Please try again.</h3>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;