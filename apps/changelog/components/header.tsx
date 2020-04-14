import React from 'react';
import styled from '@emotion/styled';

const Container = styled.header`
  position: sticky;
  top: 0;
  width: 100%;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #eaeaea;
  z-index: 1000;
  background-color: #fff;
  box-shadow: rgba(0, 0, 0, 0.08) 0px 1px 8px;
`;

const Content = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 0 1rem;
  max-width: 1024px;
  text-align: center;
`;

export const Header: React.FC = ({children}) => {
  return (
    <Container>
      <Content>{children}</Content>
    </Container>
  );
};
