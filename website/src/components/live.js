import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import {Loading} from './loading';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {hasError: false};
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return {hasError: true};
  }

  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Fallback
      return <span>Something went wrong.</span>;
    }

    return this.props.children;
  }
}

const LiveContent = () => {
  const Diff = React.lazy(() => import('../components/diff'));

  return (
    <ErrorBoundary>
      <React.Suspense fallback={<Loading color="#fff" height="300px" />}>
        <Diff />
      </React.Suspense>
    </ErrorBoundary>
  );
};

export const Live = () => {
  return (
    <div className="live">
      <div className="live-wrapper">
        <BrowserOnly>{() => <LiveContent />}</BrowserOnly>
      </div>
    </div>
  );
};
