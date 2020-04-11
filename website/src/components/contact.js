import React, {useState, useCallback, useEffect} from 'react';
import styled from 'styled-components';
import {Send} from 'react-feather';

import {useMutation} from '../hooks/use-graphql';

const Form = styled.form`
  position: relative;
  padding: 10px 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom: solid 1px #4d6894;
  box-sizing: border-box;
  &:hover {
    border-color: #4a4a4a;
  }
  &:focus {
    border-color: #fff;
  }
`;

const Submit = styled.button`
  margin: 0;
  padding: 0;
  background-color: transparent;
  outline: none;
  border: 0 none;
  color: #4a4a4a;
  cursor: pointer;
  &:hover {
    color: #000;
  }
`;

const Input = styled.input`
  flex: 1;
  font-size: 15px;
  font-weight: 300;
  color: #000;
  background: transparent;
  outline: none;
  border: 0 none;
  &::placeholder {
    color: #4a4a4a;
  }
`;

const Status = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  font-size: 12px;
  font-weight: 300;
  margin-bottom: -20px;
`;

const Error = styled(Status)`
  color: #cc2b14;

  a {
    font-weight: bold;
    text-decoration: underline;
    color: #cc2b14;
  }
`;

const Success = styled(Status)`
  color: #4b5ff7;
`;

export default function Contact({className}) {
  const [email, setEmail] = useState();
  const [result, mutate] = useMutation(
    `mutation sayHi($email: String!, $project: String!) { sayHi(email: $email, project: $project) { ok } }`,
  );
  const onSubmit = useCallback(
    event => {
      event.preventDefault();
      mutate({email, project: 'GRAPHQL_INSPECTOR'});
    },
    [email, mutate],
  );
  const onChange = useCallback(
    event => {
      if (!result.loading) {
        setEmail(event.target.value);
      }
    },
    [setEmail, result.loading],
  );

  useEffect(() => {
    if (result.complete) {
      setEmail('');
    }
  }, [result.complete, setEmail]);

  return (
    <div className={className}>
      <Form onSubmit={onSubmit}>
        <Input
          disabled={result.loading}
          type="text"
          value={email}
          onChange={onChange}
          placeholder="Type your email here"
        />
        <Submit type="submit">
          <Send />
        </Submit>
        {result.error && (
          <Error>
            Something went wrong, please let us know on{' '}
            <a href="https://twitter.com/kamilkisiela" target="BLANK">
              Twitter
            </a>
          </Error>
        )}
        {result.data && <Success>We'll contact you soon!</Success>}
      </Form>
    </div>
  );
}
