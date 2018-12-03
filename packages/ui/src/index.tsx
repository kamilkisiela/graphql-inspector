import React from 'react';
import ReactDOM from 'react-dom';
import {initializeIcons} from '@uifabric/icons';
import {ApolloClient} from 'apollo-client';
import {createHttpLink} from 'apollo-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {ApolloProvider} from 'react-apollo-hooks';
import './styles.css';
import App from './App';

initializeIcons();

const port = typeof process.env.PORT !== 'undefined' ? parseInt(process.env.PORT, 10) : 4000;

const httpLink = createHttpLink({
  uri: `http://localhost:${port}/api`,
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: httpLink,
});

function Root() {
  return (
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  );
}

ReactDOM.render(<Root />, document.getElementById('root'));
