import { FC } from 'react';
import {
  FeatureList,
  HeroGradient,
  HeroIllustration,
} from '@theguild/components';
import { handlePushRoute, NPMBadge } from '@guild-docs/client';
import { Live } from '../components/live';
import { Contact } from '../components/contact';

const FEATURE_LIST = [
  {
    title: 'Works with GitHub',
    description: `Start using our GitHub Application, setup everything within few clicks. Using GitHub workflows? Try out the GitHub Action.`,
    image: {
      src: 'assets/img/illustrations/github.png',
      alt: 'Github',
    },
    link: {
      children: 'View source code',
      title: 'View source code',
      target: '_blank',
      href: 'https://github.com/kamilkisiela/graphql-inspector',
    },
  },
  {
    title: 'Continuous Integrations',
    description: `GraphQL Inspector can be used in any Continuous Integration service. Use our modularized, CI suited version of CLI.`,
    image: { src: 'assets/img/illustrations/result.png', alt: 'Ci' },
    link: {
      children: 'Learn more',
      title: 'How to use GraphQL Inspector in CI/CD',
      href: '/docs/products/ci',
    },
  },
  {
    title: 'Command-Line',
    description: `GraphQL Inspector offers a CLI that lets you analyze your GraphQL API but also client-side applications.`,
    image: {
      src: 'assets/img/illustrations/typewriter.png',
      alt: 'cli',
    },
    link: {
      children: 'Lean more',
      title: 'Learn how to use GraphQL Inspector CLI',
      href: '/docs/essentials/diff',
    },
  },
  {
    title: 'Entirely Open Source',
    description: `Our codebase is publicly available on GitHub and it's easy to deploy and use your GitHub Application.`,
    image: {
      src: 'assets/img/illustrations/hacker-mindset.png',
      alt: 'cli',
    },
    link: {
      children: 'View source code',
      title: 'View source code',
      target: '_blank',
      href: 'https://github.com/kamilkisiela/graphql-inspector',
    },
  },
];

const IndexPage: FC = () => {
  return (
    <>
      <HeroGradient
        title="GraphQL Inspector"
        description="Validate schemas and detect changes. Receive schema change notifications. Keep Operations and Fragments consistent."
        link={{
          href: '/docs/introduction',
          children: 'Get Started',
          title: 'Get started with GraphQL Inspector Docs',
          onClick: (e) => handlePushRoute('/docs/introduction', e),
        }}
        colors={['#2e2e2e', '#fff']}
        version={<NPMBadge name="@graphql-inspector/cli" />}
        image={{
          src: '/assets/img/ui/cover.svg',
          alt: 'Illustration',
        }}
      />

      <FeatureList title="" items={FEATURE_LIST} />

      <HeroIllustration
        title="In-Code Annotations"
        description="GitHub offers in-code annotations and GraphQL Inspector, both App and Action enables you to use them. Nice and clean way to understand what have really changed and how it looked before and after."
        image={{
          src: '/assets/img/ui/features/annotations.png',
          alt: 'Illustration',
          loading: 'lazy',
        }}
        flipped
      />

      <HeroIllustration
        title="Notifications"
        description="Stay up to date with changes in GraphQL Schema. Receive notifications on Slack, Discord or even via Webhooks every time new changes are introduced."
        image={{
          src: '/assets/img/ui/features/notifications.png',
          alt: 'Illustration',
          loading: 'lazy',
        }}
      />

      <HeroIllustration
        title="Detect Changes"
        description="Prevent breaking changes on Pull Request and Push levels. Get a fully detailed summary with a list of proposed changes to the GraphQL Schema and decide whether or not to implement them."
        image={{
          src: '/assets/img/ui/features/schema-check.png',
          alt: 'Schema Validation',
          loading: 'lazy',
        }}
        flipped
      />

      <HeroIllustration
        title="Intercept via HTTP"
        description="On every schema checking, your http endpoint receives a list of changes, list of related Pull Request or a commit SHA. Decide about the status of Pull Request."
        image={{
          src: '/assets/img/ui/features/intercept.png',
          alt: 'Intercept changes via HTTP',
          loading: 'lazy',
        }}
        flipped
      />

      <Live />

      <Contact />
    </>
  );
};

export default IndexPage;
