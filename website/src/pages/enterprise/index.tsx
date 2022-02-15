import { FC } from 'react';
import Head from 'next/head';
import { handlePushRoute } from '@guild-docs/client';
import {
  FeatureList,
  HeroGradient,
  HeroIllustration,
} from '@theguild/components';
import { Check } from 'react-feather';
import { Contact } from '../../components/contact';
import styles from './enterprise.module.css';

const FEATURE_LIST = [
  {
    title: 'No limits',
    description: 'Keep calm and use all features without limits.',
    image: {
      src: 'assets/img/illustrations/counting-stars.png',
      loading: 'lazy',
      alt: 'No limits',
    },
  },
  {
    title: 'Dedicated Infrastructure',
    description: `Every new change in GraphQL Inspector is well-tested in our free service.`,
    image: {
      src: 'assets/img/illustrations/server-cluster.png',
      alt: 'Dedicated Infrastructure',
      loading: 'lazy',
    },
  },
  {
    title: 'Guaranteed Uptime SLA',
    description: 'Up to 99.9% with 24/7 infrastructure monitoring.',
    image: {
      src: 'assets/img/illustrations/typewriter.png',
      loading: 'lazy',
      alt: 'Guaranteed Uptime SLA',
    },
  },
  {
    title: 'Long-Term Support',
    description: `Gain priority in bug fixes. Upgrade assistance and in-person troubleshooting.`,
    image: {
      src: 'assets/img/illustrations/bug-fixing.png',
      loading: 'lazy',
      alt: 'Long-Term Support',
    },
  },
  {
    title: 'Priority Support Channels',
    description: `Contact us on Slack, Discord, Email or any messaging platform and get an immediate response. Get 24x7x365 technical support.`,
    image: {
      src: 'assets/img/illustrations/real-time-collaboration.png',
      loading: 'lazy',
      alt: 'Dedicated Infrastructure',
    },
  },
  {
    title: 'Shape Inspector Together',
    description: `Take part in new features decision making. Get a priority and shape GraphQL Inspector with us. Get everything tailored to your needs, even more.`,
    image: {
      src: 'assets/img/illustrations/new-ideas.png',
      loading: 'lazy',
      alt: 'Shape Inspector Together',
    },
  },
];

const EnterprisePage: FC = () => {
  return (
    <>
      <Head>
        <title>Enterprise</title>
      </Head>

      <HeroGradient
        title="Enterprise Edition"
        description={
          <>
            <p>Everything tailored to your needs.</p>
            <p>Priority support channels 24/7.</p>
            <p>Early access to BitBucket and Azure integrations.</p>
          </>
        }
        link={{
          href: '#contact-us',
          children: 'Contact Us',
          title: 'Contact us | GraphQL Inspector',
          onClick: (e) => handlePushRoute('#contact-us', e),
        }}
        colors={['#fff', '#2e2e2e']}
        image={{
          src: '/assets/img/ui/enterprise-cover.svg',
          alt: 'Illustration',
        }}
      />

      <FeatureList title="" items={FEATURE_LIST as any} />

      <HeroIllustration
        title="Premium benefits"
        description={
          <ul className={styles.enterpriseList}>
            {[
              'No limits',
              'Long-term support (LTS)',
              'Technical guidance on GraphQL design',
              'Dedicated infrastructure',
              'Support channels',
              'Well-tested on free infrastructure',
              'New features decision making',
              'Early access to new features',
            ].map((text) => (
              <li key={text}>
                <Check className={styles.enterpriseIcon} size={20} />
                {text}
              </li>
            ))}
          </ul>
        }
        image={{
          src: '/assets/img/illustrations/winners.png',
          alt: 'GraphQL Inspector Enterprise Edition',
          loading: 'lazy',
        }}
        flipped
      />

      <Contact />
    </>
  );
};

export default EnterprisePage;
