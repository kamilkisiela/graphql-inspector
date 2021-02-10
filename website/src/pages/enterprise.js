import React from 'react';
import Link from '@docusaurus/Link';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Image from '@theme/IdealImage';
import Footer from '@theme/Footer';
import {Check} from 'react-feather';
import {Contact} from '../components/contact';
import {Feature} from '../components/feature';
import {Highlights} from '../components/highlights';
import {Nav} from '../components/nav';
import styles from './enterprise.module.css';

const Header = () => {
  return (
    <div id="main-header">
      <div className="container">
        <h1>
          <span>Enterprise</span> Edition
        </h1>
        <h2>
          Everything tailored to your needs.
          <br />
          Priority support channels 24/7.
          <br />
          Early access to BitBucket and Azure integrations.
        </h2>

        <Link
          href="#contact-us"
          title="Contact us | GraphQL Inspector"
          className="main-button scroll-to"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
};

function Enterprise() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  const {title, tagline, url, favicon} = siteConfig;

  const ogImage = `${url}/img/github/app-action.jpg`;
  const siteTitle = `Enterprise - ${title}`;

  return (
    <div>
      <Head>
        <meta property="og:description" content={tagline} />
        <meta charSet="utf-8" />
        <meta property="og:image" content={ogImage} />
        <meta property="twitter:image" content={ogImage} />
        <meta name="twitter:image:alt" content="Image for GraphQL Inspector" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="og:title" content={siteTitle} />
        <meta name="description" content={tagline} />
        <meta property="og:description" content={tagline} />
        <meta property="og:url" content={url} />
        <link rel="shortcut icon" href={favicon}></link>
        <title>{siteTitle}</title>
      </Head>
      <div className="mainContainer enterprise">
        <Nav
          link={{
            to: '/',
            title: 'GraphQL Inspector',
            label: 'Homepage',
          }}
        />
        <Header />
      </div>
      <Highlights
        highlights={[
          {
            title: 'No limits',
            text: (
              <p>
                Keep calm and use all features <strong>without limits</strong>.
              </p>
            ),
            link: null,
            img: (
              <Image
                img={require('../../static/img/illustrations/counting-stars.png')}
                alt="No limits"
                loading="lazy"
              />
            ),
          },
          {
            title: 'Dedicated Infrastructure',
            text: (
              <p>
                Every new change in GraphQL Inspector is well-tested in our free
                service.
              </p>
            ),
            link: null,
            img: (
              <Image
                img={require('../../static/img/illustrations/server-cluster.png')}
                alt="Dedicated Infrastructure"
                loading="lazy"
              />
            ),
          },
          {
            title: 'Guaranteed Uptime SLA',
            text: <p>Up to 99.9% with 24/7 infrastructure monitoring</p>,
            link: null,
            img: (
              <Image
                img={require('../../static/img/illustrations/yoga.png')}
                alt="Guaranteed Uptime SLA"
                loading="lazy"
              />
            ),
          },
          {
            title: 'Long-Term Support',
            text: (
              <p>
                Gain priority in bug fixes.
                <br />
                Upgrade assistence and in-person troubleshooting.
              </p>
            ),
            link: null,
            img: (
              <Image
                img={require('../../static/img/illustrations/bug-fixing.png')}
                alt="Long-Term Support"
                loading="lazy"
              />
            ),
          },
          {
            title: 'Priority Support Channels',
            text: (
              <p>
                Contact us on Slack, Discord, Email or any messaging platform
                and <strong>get an immediate response</strong>.
                <br />
                Get 24x7x365 technical support.
              </p>
            ),
            link: null,
            img: (
              <Image
                img={require('../../static/img/illustrations/real-time-collaboration.png')}
                alt="Dedicated Infrastructure"
                loading="lazy"
              />
            ),
          },
          {
            title: 'Shape Inspector Together',
            text: (
              <p>
                Take part in new features decision making.
                <br />
                Get a priority and{' '}
                <strong>shape GraphQL Inspector with us</strong>.
                <br />
                Get everything tailored to your needs, even more.
              </p>
            ),
            link: null,
            img: (
              <Image
                img={require('../../static/img/illustrations/new-ideas.png')}
                alt="Dedicated Infrastructure"
                loading="lazy"
              />
            ),
          },
        ]}
      />
      <Feature
        reversed={true}
        img={
          <Image
            img={require('../../static/img/illustrations/winners.png')}
            alt="GraphQL Inspector Enterprise Edition"
            loading="lazy"
          />
        }
        title="Premium benefits"
        text={
          <ul className={styles.enterpriseList}>
            <li>
              <Check className={styles.enterpriseIcon} size={20} /> No limits
            </li>
            <li>
              <Check className={styles.enterpriseIcon} size={20} /> Long-term
              support (LTS)
            </li>
            <li>
              <Check className={styles.enterpriseIcon} size={20} /> Technical
              guidance on GraphQL design
            </li>
            <li>
              <Check className={styles.enterpriseIcon} size={20} /> Dedicated
              infrastructure
            </li>
            <li>
              <Check className={styles.enterpriseIcon} size={20} /> Support
              channels
            </li>
            <li>
              <Check className={styles.enterpriseIcon} size={20} /> Well-tested
              on free infrastructure
            </li>
            <li>
              <Check className={styles.enterpriseIcon} size={20} /> New features
              decision making
            </li>
            <li>
              <Check className={styles.enterpriseIcon} size={20} /> Early access
              to new features
            </li>
          </ul>
        }
      />
      <Contact />
      <Footer />
    </div>
  );
}

export default Enterprise;
