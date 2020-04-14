import React from 'react';
import styled from '@emotion/styled';

const Container = styled.footer`
  width: 100%;
  display: flex;
  align-items: center;
  border-top: 1px solid #eaeaea;
  z-index: 1000;
  background-color: #fafafa;
`;

const Content = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 0 1rem;
  max-width: 1024px;
  text-align: center;

  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Footer: React.FC = ({children}) => {
  return (
    <Container>
      <Content>{children}</Content>
    </Container>
  );
};
