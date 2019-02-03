import React, {lazy, Suspense} from 'react';
import Loading from './Loading';

const Diff = lazy(() => import('./diff/Diff'));

function App() {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <Diff />
      </Suspense>
    </div>
  );
}

export default App;
