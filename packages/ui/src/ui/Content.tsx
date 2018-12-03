import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
`;

const Title = styled.h2`
  margin: 0 0 30px 0;
  font-size: 28px;
  font-weight: 200;
`;

export default function Content(props: {
  title: string;
  children: (props: {}) => React.ReactNode;
}) {
  return (
    <Container>
      <Title>{props.title}</Title>
      <div>{props.children({})}</div>
    </Container>
  );
}
