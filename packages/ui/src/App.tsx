import React, {Component} from 'react';
import styled from 'styled-components';

const Header = styled.h1`
  flex: 1;
  flex-grow: 0;
  flex-shrink: 0;
  color: #333;
  padding: 20px 20px 40px 20px;
  margin: 0;
  font-size: 24px;
  font-weight: 600;
`;

const Body = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const Left = styled.div`
  height: 100%;
  background-color: #fff;
  border-right: 1px solid rgb(234, 234, 234);
`;

const Menu = styled.nav`
  flex-direction: row;
  flex: 1;
`;

const MenuItem = styled.a`
  display: flex;
  flex-grow: 1;
  flex-shrink: 0;
  padding: 15px 0 15px 30px;
  color: #333;
  background-color: #fff;
  vertical-align: middle;
  text-overflow: ellipsis;
  font-size: 14px;
  font-weight: 400;
  overflow: hidden;
  cursor: pointer;

  &:hover {
    background-color: #f8f8f8;
  }
`;

class App extends Component {
  render() {
    return (
      <Body>
        <Left>
          <Header>GraphQL Inspector</Header>
          <Menu>
            {[
              {
                key: 'diff',
                name: 'Diff Schemas',
                onClick: () => {
                  return;
                },
              },
              {
                key: 'similar',
                name: 'Find Duplicates',
                onClick: () => {
                  return;
                },
              },
              {
                key: 'coverage',
                name: 'Schema Coverage',
                onClick: () => {
                  return;
                },
              },
              {
                key: 'validate',
                name: 'Validate documents',
                onClick: () => {
                  return;
                },
              },
            ].map(item => (
              <MenuItem key={item.key} onClick={item.onClick}>
                {item.name}
              </MenuItem>
            ))}
          </Menu>
        </Left>
      </Body>
    );
  }
}

export default App;
