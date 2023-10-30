import { Component } from "react";
import ErrorFallback from "./ErrorFallback";
import { ErrorBoundary as SentryErrorBoundary, isInitialized } from "./Sentry";

type DefaultErrorBoundaryProps = {
  children: React.ReactNode;
};

// This error boundary is ONLY used during local development. Any changes to this component will not be
// reflected in production.
class DefaultErrorBoundary extends Component<
  DefaultErrorBoundaryProps,
  { hasError: boolean }
> {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error({ error, errorInfo });
  }

  render() {
    const { hasError } = this.state;
    if (hasError) {
      return <ErrorFallback />;
    }
    const { children } = this.props;
    return children;
  }
}

export const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const useSentry = isInitialized();

  if (useSentry) {
    return <SentryErrorBoundary>{children}</SentryErrorBoundary>;
  }
  return <DefaultErrorBoundary>{children}</DefaultErrorBoundary>;
};
