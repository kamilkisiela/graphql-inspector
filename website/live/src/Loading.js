import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  color: #fff;
`;

export default function Loading() {
  return (
    <Container>
      <div>Loading...</div>
    </Container>
  );
}
