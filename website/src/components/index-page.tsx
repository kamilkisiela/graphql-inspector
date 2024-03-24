import { ReactElement } from 'react';
import { FeatureList, HeroGradient, HeroIllustration, NPMBadge } from '@theguild/components';
import { Diff } from './diff';
import githubImage from '../../public/assets/img/illustrations/github.png';
import hackerMindsetImage from '../../public/assets/img/illustrations/hacker-mindset.png';
import hiveImage from '../../public/assets/img/illustrations/hive.png';
import resultImage from '../../public/assets/img/illustrations/result.png';
import typewritterImage from '../../public/assets/img/illustrations/typewriter.png';
import coverImage from '../../public/assets/img/ui/cover.svg';
import annotationsImage from '../../public/assets/img/ui/features/annotations.png';
import interceptImage from '../../public/assets/img/ui/features/intercept.png';
import notificationsImage from '../../public/assets/img/ui/features/notifications.png';
import schemaCheckImage from '../../public/assets/img/ui/features/schema-check.png';

const FEATURE_LIST = [
  {
    title: 'Works with GitHub',
    description:
      'Start using our GitHub Application, setup everything within few clicks. Using GitHub workflows? Try out the GitHub Action.',
    image: {
      src: githubImage,
      alt: 'GitHub',
      loading: 'eager' as const,
    },
    linkProps: {
      children: 'View source code',
      title: 'View source code',
      target: '_blank',
      href: 'https://github.com/kamilkisiela/graphql-inspector',
    },
  },
  {
    title: 'CI/CD',
    description:
      'GraphQL Inspector can be used in any Continuous Integration service. Use our modularized, CI suited version of CLI.',
    image: { src: resultImage, alt: 'CI', loading: 'eager' as const },
    linkProps: {
      children: 'Learn more',
      title: 'How to use GraphQL Inspector in CI/CD',
      href: '/docs/products/ci',
    },
  },
  {
    title: 'Command-Line',
    description:
      'GraphQL Inspector offers a CLI that lets you analyze your GraphQL API but also client-side applications.',
    image: {
      src: typewritterImage,
      alt: 'CLI',
      loading: 'eager' as const,
    },
    linkProps: {
      children: 'Lean more',
      title: 'Learn how to use GraphQL Inspector CLI',
      href: '/docs/essentials/diff',
    },
  },
  {
    title: 'Open Source',
    description:
      "Our codebase is publicly available on GitHub and it's easy to deploy and use your GitHub Application.",
    image: {
      src: hackerMindsetImage,
      alt: 'cli',
      loading: 'eager' as const,
    },
    linkProps: {
      children: 'View source code',
      title: 'View source code',
      target: '_blank',
      href: 'https://github.com/kamilkisiela/graphql-inspector',
    },
  },
];

export function IndexPage(): ReactElement {
  return (
    <>
      <HeroGradient
        title="GraphQL Inspector"
        description="Validate schemas and detect changes. Receive schema change notifications. Keep Operations and Fragments consistent."
        link={{
          href: '/docs',
          children: 'Get Started',
          title: 'Get started with GraphQL Inspector Docs',
        }}
        colors={['#333', '#555']}
        version={<NPMBadge name="@graphql-inspector/cli" />}
        image={{
          src: coverImage,
          loading: 'eager',
          alt: 'Illustration',
          placeholder: 'empty',
        }}
      />

      <FeatureList items={FEATURE_LIST} className="dark:[&_img]:invert py-16" />

      <HeroIllustration
        title="GraphQL Hive"
        description={
          <>
            Cloud service and self-hosted Performance Monitoring tool and Schema
            <br />
            Registry built on top of GraphQL Inspector
          </>
        }
        image={{
          src: hiveImage,
          alt: 'GraphQL Hive',
          loading: 'lazy',
          className: 'rounded-xl',
        }}
        link={{
          href: 'https://graphql-hive.com',
          children: 'Take me to GraphQL Hive',
          title: 'Visit GraphQL Hive',
        }}
        className="bg-gray-100 dark:bg-zinc-900"
        flipped
      />

      <HeroIllustration
        title="In-Code Annotations"
        description="GitHub offers in-code annotations and GraphQL Inspector, both App and Action enables you to use them. Nice and clean way to understand what have really changed and how it looked before and after."
        image={{
          src: annotationsImage,
          alt: 'Illustration',
          loading: 'lazy',
        }}
      />

      <HeroIllustration
        title="Notifications"
        description="Stay up to date with changes in GraphQL Schema. Receive notifications on Slack, Discord or even via Webhooks every time new changes are introduced."
        image={{
          src: notificationsImage,
          alt: 'Illustration',
          loading: 'lazy',
        }}
        flipped
      />

      <HeroIllustration
        title="Detect Changes"
        description="Prevent breaking changes on Pull Request and Push levels. Get a fully detailed summary with a list of proposed changes to the GraphQL Schema and decide whether or not to implement them."
        image={{
          src: schemaCheckImage,
          alt: 'Schema Validation',
          loading: 'eager',
        }}
      />

      <HeroIllustration
        title="Intercept via HTTP"
        description="On every schema checking, your http endpoint receives a list of changes, list of related Pull Request or a commit SHA. Decide about the status of Pull Request."
        image={{
          src: interceptImage,
          alt: 'Intercept changes via HTTP',
          loading: 'eager',
        }}
        flipped
      />

      <Diff />
    </>
  );
}
