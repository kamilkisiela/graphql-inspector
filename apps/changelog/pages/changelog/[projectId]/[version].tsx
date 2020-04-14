import React from 'react';
import styled from '@emotion/styled';
import {useRouter} from 'next/router';
import {Button} from '@chakra-ui/core';
import Link from 'next/Link';
import {Layout} from '../../../components/layout';
import {Badge} from '../../../components/badge';
import {Changes, Change} from '../../../components/changes';
import {Code} from '../../../components/code';
import {Changelog, fetchChangelog} from '../../../data/changelog';
import {GetServerSideProps} from 'next';

const Details = styled.div`
  padding: 4rem 0px;
  width: 100%;
  margin: 0px auto;
`;

const Title = styled.div`
  position: relative;
  text-align: center;
  margin: 0 0 5rem 0;

  & > h2 {
    font-size: 2rem;
    letter-spacing: -1px;
    margin-bottom: 1rem;
    line-height: 1.3;
    font-weight: 700;
  }

  & > h3 {
    margin-top: 0.4rem;
    margin-bottom: 1rem;
    color: #696969;
    font-size: 0.79em;
  }
`;

const ChangesContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 0 1rem;
  max-width: 682px;
`;

const Footer = styled.div`
  position: relative;
  text-align: center;
  margin: 5rem auto 0 auto;
`;

export const getServerSideProps: GetServerSideProps<{
  changelog: Changelog;
}> = async () => {
  const changelog = await fetchChangelog();

  return {
    props: {changelog},
  };
};

const VersionPage: React.FC<{changelog: Changelog}> = ({changelog}) => {
  const router = useRouter();
  const {projectId, version} = router.query;
  const {website, twitter, github} = changelog.project;

  return (
    <Layout
      projectId={changelog.project.id}
      website={website}
      twitter={twitter}
      github={github}
    >
      <Details>
        <Title>
          <h2>{version}</h2>
          <h3>Monday, March 9th 2020 (about 1 month ago)</h3>
        </Title>
        <ChangesContainer>
          <Changes>
            <Change>
              <Badge variant="red">Breaking</Badge> Type{' '}
              <Code>IssueOrPullRequestEdge</Code> was removed
            </Change>
            <Change>
              <Badge variant="black">Dangerous</Badge> Type{' '}
              <Code>IssueOrPullRequestEdge</Code> was removed
            </Change>
          </Changes>
        </ChangesContainer>

        <Footer>
          <Link href={`/changelog/${projectId}`} passHref>
            <Button
              leftIcon="arrow-back"
              variantColor="gray"
              variant="ghost"
              size="sm"
            >
              Go back
            </Button>
          </Link>
        </Footer>
      </Details>
    </Layout>
  );
};

export default VersionPage;
