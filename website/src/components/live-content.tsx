import { lazy, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Loading } from './loading';

const ErrorBoundary = dynamic(() => import('../components/error-boundary'), {
  ssr: false,
});

const LiveContent = () => {
  const Diff = lazy(() => import('../components/diff'));

  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading color="#fff" height={300} />}>
        <Diff />
      </Suspense>
    </ErrorBoundary>
  );
};

export default LiveContent;
