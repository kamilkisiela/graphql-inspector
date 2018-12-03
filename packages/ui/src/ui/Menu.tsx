import React from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';
import {Icon} from 'office-ui-fabric-react/lib/Icon';

export interface MenuItem {
  key: string;
  to: string;
  name: string;
  iconName: string;
  component: () => JSX.Element;
}

const Container = styled.nav`
  flex-direction: row;
  flex: 1;
`;

const Item = styled(Link)`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  flex-shrink: 0;
  align-items: center;
  padding: 15px 15px 15px 20px;
  color: #333;
  background-color: #fff;
  vertical-align: middle;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    background-color: #f8f8f8;
  }
`;

const Label = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
  padding-left: 20px;
`;

export default function Menu(props: {menu: MenuItem[]}) {
  return (
    <Container>
      {props.menu.map(item => (
        <Item to={item.to} key={item.key}>
          <Icon iconName={item.iconName} />
          <Label>{item.name}</Label>
        </Item>
      ))}
    </Container>
  );
}
