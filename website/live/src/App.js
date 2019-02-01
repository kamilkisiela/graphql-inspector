import React, {lazy, Suspense} from 'react';

const Diff = lazy(async () => import('./diff/Diff'));

function App() {
  return (
    <div>
      <Suspense fallback={() => <div>Loading...</div>}>
        <Diff />
      </Suspense>
    </div>
  );
}

export default App;
