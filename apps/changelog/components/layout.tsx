import React from 'react';
import styled from '@emotion/styled';
import Link from 'next/Link';
import {GitHub, Twitter} from 'react-feather';
import {Header} from './header';
import {Nav} from './nav';
import {Logo} from './logo';
import {Footer} from './footer';
import {SchneiderLogo} from './schneider-logo';

const Links = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 1;
`;

const Container = styled.div``;

const Main = styled.main`
  min-height: calc(100vh - (80px + 57px));
`;

const RightNav = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 1;

  & > * {
    margin: 0 10px;
  }
`;

const A = styled.a`
  color: #696969;
  transition: color 0.2s ease;

  &:hover {
    color: #000;
  }
`;

const ALink: React.FC<{href: string}> = ({href, children}) => {
  return (
    <Link href={href} passHref>
      <A>{children}</A>
    </Link>
  );
};

export const Layout: React.FC<{
  projectId: string;
  website?: string;
  github?: string;
  twitter?: string;
}> = ({children, projectId, website, github, twitter}) => {
  const websiteLink = website ? <A href={website}>Visit our website</A> : null;
  const githubLink = github ? (
    <A href={`https://github.com/${github}`}>
      <GitHub />
    </A>
  ) : null;
  const twitterLink = twitter ? (
    <A href={`https://twitter.com/${twitter}`}>
      <Twitter />
    </A>
  ) : null;

  return (
    <Container>
      <Header>
        <Nav>
          <Links>
            <ALink href={`/changelog/${projectId}`}>
              <SchneiderLogo size={120} />
            </ALink>
            <RightNav>
              <ALink href="">Subscribe to updates</ALink>
              {websiteLink}
              {githubLink}
              {twitterLink}
            </RightNav>
          </Links>
        </Nav>
      </Header>
      <Main>{children}</Main>
      <Footer>
        <ALink href="https://graphql-inspector.com">
          <Logo size={100} />
        </ALink>
      </Footer>
    </Container>
  );
};
