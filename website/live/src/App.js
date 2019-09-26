import React, {lazy, Suspense} from 'react';
import {useRouter} from 'react-tiniest-router';
import Loading from './Loading';
import routes from './routes';

const Diff = lazy(() => import('./diff/Diff'));
const Contact = lazy(() => import('./contact/Contact'));

function App() {
  const {isRoute} = useRouter();

  console.log('got to App');

  return (
    <Suspense fallback={<Loading />}>
      working!
      {isRoute(routes.diff) && <Diff />}
      {isRoute(routes.contact) && <Contact />}
    </Suspense>
  );
}

export default App;
