import { useState, useCallback } from 'react';

type State = {
  complete: boolean;
  loading: boolean;
  error: string | null;
  data: object | null;
};

type Mutate = (variables: Record<string, unknown>) => void;

const ENDPOINT_URL = 'https://guild-ms-slack-bot.vercel.app/api/graphql';

const DEFAULT_STATE = {
  complete: false,
  loading: false,
  error: null,
  data: null,
};

export function useMutation(query: string): [State, Mutate] {
  const [state, setState] = useState<State>(DEFAULT_STATE);

  const mutate = useCallback(
    async (variables) => {
      setState({
        ...DEFAULT_STATE,
        loading: true,
      });
      try {
        const response = await fetch(ENDPOINT_URL, {
          mode: 'no-cors',
          cache: 'no-cache',
          method: 'POST',
          body: JSON.stringify({ query, variables }),
        });
        const data = await response.json();

        if (data.errors) {
          throw new Error('Try Again');
        }

        setState({
          ...DEFAULT_STATE,
          complete: true,
          data,
        });
      } catch (error) {
        setState({
          ...DEFAULT_STATE,
          complete: true,
          error: error.toString ? error.toString() : error,
        });
      }
    },
    [query],
  );

  return [state, mutate];
}
