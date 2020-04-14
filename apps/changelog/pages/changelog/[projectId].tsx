import React from 'react';
import styled from '@emotion/styled';
import {GetServerSideProps} from 'next';
import Link from 'next/Link';
import {Button} from '@chakra-ui/core';
import {CriticalityLevel} from '@graphql-inspector/core';
import {Layout} from '../../components/layout';
import {Badge} from '../../components/badge';
import {Changes, Change} from '../../components/changes';
import {Code} from '../../components/code';
import { Changelog, fetchChangelog } from '../../data/changelog';

const Card = styled.div`
  padding: 2.5rem 0;
  margin-bottom: -1px;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 5px 40px rgba(0, 0, 0, 0.04);
  }
`;

const CardContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 0 1rem;
  max-width: 682px;

  & > h2 {
    display: inline-block;
    font-weight: 600;
    font-size: 1.4em;
  }
`;

const CardDetails = styled.p`
  margin-top: 0.4rem;
  margin-bottom: 1rem;
  color: #696969;
  font-size: 0.79em;
`;

const List = styled.div`
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
`;

const Footer = styled.div`
  position: relative;
  text-align: center;
  margin: 0 auto 4rem auto;
`;

const LoadMore: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const loadMore = React.useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, [setLoading]);

  const loadingProps = loading
    ? {
        isLoading: true,
        loadingText: 'Loading',
      }
    : {};

  return (
    <Button
      variantColor="gray"
      variant="ghost"
      size="sm"
      {...loadingProps}
      onClick={loadMore}
    >
      Load more
    </Button>
  );
};

export const getServerSideProps: GetServerSideProps<{
  changelog: Changelog;
}> = async () => {
  const changelog = await fetchChangelog()

  return {
    props: {changelog},
  };
};

const ChangelogPage: React.FC<{changelog: Changelog}> = ({changelog}) => {
  const projectId = changelog.project.id;
  const projectName = changelog.project.name;
  const {website, twitter, github} = changelog.project;

  return (
    <Layout
      projectId={projectId}
      website={website}
      twitter={twitter}
      github={github}
    >
      <List>
        <Title>
          <h2>{projectName}</h2>
        </Title>
        {changelog.releases.map((release) => {
          return (
            <Card key={release.version}>
              <CardContainer>
                <h2>
                  <Link href={`/changelog/${projectId}/${release.version}`}>
                    {release.version}
                  </Link>
                </h2>
                <CardDetails>
                  {release.createdAt} ({release.timeAgo})
                </CardDetails>
                <Changes>
                  {release.changes.map((change, i) => {
                    const hasBadge =
                      change.level !== CriticalityLevel.NonBreaking;
                    const variant =
                      change.level === CriticalityLevel.Breaking
                        ? 'red'
                        : 'black';
                    const badge =
                      change.level === CriticalityLevel.Breaking
                        ? 'Breaking'
                        : 'Dangerous';

                    return (
                      <Change key={i}>
                        {hasBadge ? (
                          <Badge variant={variant}>{badge}</Badge>
                        ) : null}{' '}
                        Type <Code>IssueOrPullRequestEdge</Code> was removed
                      </Change>
                    );
                  })}
                </Changes>
              </CardContainer>
            </Card>
          );
        })}
      </List>
      <Footer>
        <LoadMore />
      </Footer>
    </Layout>
  );
};

export default ChangelogPage;
