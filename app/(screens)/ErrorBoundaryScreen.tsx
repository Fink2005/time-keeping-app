/* eslint-disable no-console */
import React from 'react';

class ErrorBoundaryInner extends React.Component<any, any> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, info: any) {
    console.log('Caught by boundary:', error, info);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return this.props.fallback(this.reset, this.state.error);
    }
    return this.props.children;
  }
}

export default function ErrorBoundary({ children, fallback }: any) {
  return <ErrorBoundaryInner fallback={fallback}>{children}</ErrorBoundaryInner>;
}
