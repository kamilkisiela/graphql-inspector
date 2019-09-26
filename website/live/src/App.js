import React, {lazy, Suspense} from 'react';
import Loading from './Loading';

const Diff = lazy(() => import('./diff/Diff'));
const Contact = lazy(() => import('./contact/Contact'));

function App() {
  const page = window.location.hash.replace('#', '');
  const isContact = page === 'contact';

  return (
    <Suspense fallback={<Loading />}>
      {isContact && <Contact />}
      {!isContact && <Diff />}
    </Suspense>
  );
}

export default App;
