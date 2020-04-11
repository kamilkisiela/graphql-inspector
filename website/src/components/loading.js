import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  height: ${props => props.height};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  color: ${props => props.color};
`;

export function Loading({color, height}) {
  return (
    <Container color={color} height={height}>
      <div>Loading...</div>
    </Container>
  );
}
