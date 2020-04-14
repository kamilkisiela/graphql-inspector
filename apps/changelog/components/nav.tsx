import React from 'react';
import styled from '@emotion/styled';

const Container = styled.nav`
  position: relative;
  display: flex;
  flex: 1;
  height: 80px;
  align-items: center;
`;

export const Nav: React.FC = ({children}) => {
  return <Container>{children}</Container>;
};
