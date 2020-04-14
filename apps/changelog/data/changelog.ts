import {CriticalityLevel} from '@graphql-inspector/core';

interface Change {
  message: string;
  level: CriticalityLevel;
}

interface Release {
  version: string;
  createdAt: string;
  timeAgo: string;
  changes: Change[];
}

interface Project {
  id: string;
  name: string;
  twitter?: string;
  github?: string;
  website?: string;
}

export interface Changelog {
  project: Project;
  releases: Release[];
}

export async function fetchChangelog(): Promise<Changelog> {
  return {
    project: {
      id: 'schneider',
      name: 'Schneider Electric',
      website: 'https://schneider-electric.com',
      github: 'kamilkisiela/graphql-inspector',
      twitter: 'kamilkisiela',
    },
    releases: [
      {
        version: '1.13.3',
        createdAt: 'Monday, April 10th 2020',
        timeAgo: '5 days ago',
        changes: [
          {
            level: CriticalityLevel.Breaking,
            message: `Type 'IssueOrPullRequestEdge' was removed`,
          },
          {
            level: CriticalityLevel.Dangerous,
            message: `Type 'IssueOrPullRequestEdge' was removed`,
          },
          {
            level: CriticalityLevel.NonBreaking,
            message: `Type 'IssueOrPullRequestEdge' was removed`,
          },
        ],
      },
      {
        version: '2020-03-25',
        createdAt: 'Monday, March 25th 2020',
        timeAgo: '1 month ago',
        changes: [
          {
            level: CriticalityLevel.Breaking,
            message: `Type 'IssueOrPullRequestEdge' was removed`,
          },
          {
            level: CriticalityLevel.NonBreaking,
            message: `Type 'IssueOrPullRequestEdge' was removed`,
          },
          {
            level: CriticalityLevel.NonBreaking,
            message: `Type 'IssueOrPullRequestEdge' was removed`,
          },
        ],
      },
    ],
  };
}
