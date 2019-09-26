import React from 'react';
import {Router} from 'react-tiniest-router';
import App from './App';
import routes from './routes';

export default function Root() {
  return (
    <Router routes={routes}>
      <App />
    </Router>
  );
}
