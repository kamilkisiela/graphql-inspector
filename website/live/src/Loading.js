import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  color: ${props => props.color};
`;

export default function Loading({color}) {
  return (
    <Container color={color}>
      <div>Loading...</div>
    </Container>
  );
}
