import React from "react";

class ErrorBoundary extends React.Component<{}, { hasError: boolean }> {
  public static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  public constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  public render(): JSX.Element | React.ReactNode {
    const { hasError } = this.state;
    const { children } = this.props;
    if (hasError) {
      // TODO: render error banner
      return <h1>Something went wrong.</h1>;
    }

    return children;
  }
}

export { ErrorBoundary };
