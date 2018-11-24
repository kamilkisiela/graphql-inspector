import React, {Component} from 'react';
import styled from 'styled-components';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Menu from './ui/Menu';
import Content from './ui/Content';
import routes from './routes';

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

const Center = styled.div`
  flex: 1;
`;

class App extends Component {
  render() {
    return (
      <Router>
        <Body>
          <Left>
            <Header>GraphQL Inspector</Header>
            <Menu menu={routes} />
          </Left>
          <Center>
            {routes.map(route => (
              <Route
                exact
                path={route.to}
                key={route.key}
                render={() => <Content title={route.name}>{() => <route.component/>}</Content>}
              />
            ))}
          </Center>
        </Body>
      </Router>
    );
  }
}

export default App;
