# Vitamins - JavaScript error tracking libary

## Features

- Immutable error logs
- Breadcrumbs
- Sync with localstorage
- Captures all errors and unhandled promise rejections
- Logger helper for more readible console.log
- Debounce and throttles for performance increasement in heavy requests

```jsx
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.props.tracker.error(error, 'react');
  }

  render() {
    if (this.state.hasError && this.props.errorPage)
      return this.props.errorPage;
    else if (this.state.hasError) return <h1>Something went wrong.</h1>;

    return this.props.children;
  }
}

export default ErrorBoundary;
```
