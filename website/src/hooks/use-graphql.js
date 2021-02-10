import {useState, useCallback} from 'react';
import fetchPonyfill from 'fetch-ponyfill';

const {fetch} = fetchPonyfill();

const endpoint = 'https://guild-ms-slack-bot.vercel.app/api/graphql';

export function useMutation(query) {
  const [state, setState] = useState({
    complete: false,
    loading: false,
    error: null,
    data: null,
  });

  const mutate = useCallback(
    (variables) => {
      setState({
        complete: false,
        loading: true,
        data: null,
        error: null,
      });

      fetch(endpoint, {
        mode: 'no-cors',
        cache: 'no-cache',
        method: 'POST',
        body: JSON.stringify({
          query,
          variables,
        }),
      })
        .then((data) => data.json())
        .then((data) => {
          if (data.errors) {
            return Promise.reject(new Error('Try Again'));
          }

          setState({
            complete: true,
            loading: false,
            error: null,
            data,
          });
        })
        .catch((error) => {
          setState({
            complete: true,
            loading: false,
            data: null,
            error: error.toString ? error.toString() : error,
          });
        });
    },
    [query],
  );

  return [state, mutate];
}
