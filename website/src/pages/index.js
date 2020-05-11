import React from 'react';
import Link from '@docusaurus/Link';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Image from '@theme/IdealImage';
import Footer from '@theme/Footer';
import styles from './index.module.css';
import {Live} from '../components/live';
import {Contact} from '../components/contact';
import {Feature} from '../components/feature';
import {Highlights} from '../components/highlights';
import {Nav} from '../components/nav';

const Header = () => {
  return (
    <div id="main-header">
      <div className="container">
        <h1>
          <span>Bulletproof</span> your GraphQL
        </h1>
        <h2>
          Validate schemas and detect changes. Receive schema change
          notifications. Keep Operations and Fragments consistent.
        </h2>
        <Link
          to="/docs"
          className="main-button"
          title="Documentation | GraphQL Inspector"
        >
          Documentation
        </Link>
      </div>
    </div>
  );
};

function Index() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  const {title, tagline, url, favicon} = siteConfig;

  const ogImage = `${url}/img/github/app-action.jpg`;

  return (
    <div>
      <Head>
        <meta property="og:description" content={tagline} />
        <meta charSet="utf-8" />
        <meta property="og:image" content={ogImage} />
        <meta property="twitter:image" content={ogImage} />
        <meta name="twitter:image:alt" content="Image for GraphQL Inspector" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="og:title" content={`${title} - ${tagline}`} />
        <meta name="description" content={tagline} />
        <meta property="og:description" content={tagline} />
        <meta property="og:url" content={url} />
        <link rel="shortcut icon" href={favicon}></link>
        <title>
          {title} - {tagline}
        </title>
      </Head>
      <div className="mainContainer">
        <Nav
          link={{
            to: '/enterprise',
            title: 'Enterprise - GraphQL Inspector',
            label: 'Enterprise',
          }}
        />
        <Header />
      </div>

      <Highlights
        highlights={[
          {
            title: 'Works with GitHub',
            text: (
              <p>
                Start using our <strong>GitHub Application</strong>, setup
                everything within few clicks.
                <br />
                Using GitHub workflows? Try out the{' '}
                <strong>GitHub Action</strong>!
              </p>
            ),
            link: (
              <div className={styles.indexGithubLinks}>
                <Link
                  to="/docs/products/github"
                  title="How to use GraphQL Inspector in GitHub repository"
                >
                  Learn more
                </Link>
                <br />
                <Link href="/install" title="Use GitHub Application">
                  Install Application
                </Link>
                <Link href="/action" title="Use GitHub Action">
                  Use Action
                </Link>
              </div>
            ),
            img: (
              <Image
                img={require('../../static/img/illustrations/github.png')}
                alt="GitHub App and Action"
                loading="lazy"
              />
            ),
          },
          {
            title: 'Continous Integrations',
            text: (
              <p>
                GraphQL Inspector can be used in any Continous Integration
                service.Use our modularized, CI suited version of CLI.
              </p>
            ),
            link: (
              <Link
                to="/docs/products/ci"
                title="How to use GraphQL Inspector in CI/CD"
              >
                Learn more
              </Link>
            ),
            img: (
              <Image
                img={require('../../static/img/illustrations/result.png')}
                alt="Continous Integrations"
                loading="lazy"
              />
            ),
          },
          {
            title: 'Command-Line',
            text: (
              <p>
                <strong>GraphQL Inspector offers a CLI</strong> that lets you
                analyze your GraphQL API but also client-side applications.
              </p>
            ),
            link: (
              <Link
                to="/docs/essentials/diff"
                title="Learn how to use GraphQL Inspector CLI"
              >
                Lean more
              </Link>
            ),
            img: (
              <Image
                img={require('../../static/img/illustrations/typewriter.png')}
                alt="Command-Line"
                loading="lazy"
              />
            ),
          },
          {
            title: 'Entirely Open-Source',
            text: (
              <p>
                Our codebase is publicly available on GitHub and it's easy to
                deploy and use your GitHub Application.
              </p>
            ),
            link: (
              <a
                href="https://github.com/kamilkisiela/graphql-inspector"
                title="Visit GraphQL Inspector repository"
              >
                Source code
              </a>
            ),
            img: (
              <Image
                img={require('../../static/img/illustrations/hacker-mindset.png')}
                alt="Entirely Open-Source"
                loading="lazy"
              />
            ),
          },
        ]}
      />

      <Feature
        img={
          <Image
            img={require('../../static/img/ui/features/annotations.png')}
            alt="Annotations"
            loading="lazy"
          />
        }
        title="In-Code Annotations"
        text={
          <>
            <p>
              GitHub offers <strong>in-code annotations</strong> and GraphQL
              Inspector, both App and Action enables you do use them.
            </p>
            <p>
              Nice and clean way to understand what have really changed and how
              it looked before and after.
            </p>
          </>
        }
      />

      <Feature
        reversed={true}
        img={
          <Image
            img={require('../../static/img/ui/features/notifications.png')}
            alt="Notifications"
            loading="lazy"
          />
        }
        title="Notifications"
        text={
          <>
            <p>Stay up to date with changes in GraphQL Schema.</p>
            <p>
              Receive notifications on <strong>Slack</strong>,{' '}
              <strong>Discord</strong> or even via <strong>WebHooks</strong>{' '}
              every time new changes are introduced.
            </p>
          </>
        }
      />

      <Feature
        img={
          <Image
            img={require('../../static/img/ui/features/schema-check.png')}
            alt="Schema Validation"
            loading="lazy"
          />
        }
        title="Detect Changes"
        text={
          <>
            <p>
              <strong>Prevent breaking changes</strong> on Pull Request and Push
              levels.
            </p>
            <p>
              Get a fully detailed summary with a list of proposed changes to
              the GraphQL Schema and decide whether or not to implement them.
            </p>
          </>
        }
      />

      <Feature
        reversed={true}
        img={
          <Image
            img={require('../../static/img/ui/features/intercept.png')}
            alt="Intercept changes via HTTP"
            loading="lazy"
          />
        }
        title="Intercept via HTTP"
        text={
          <>
            <p>
              On every schema checking, your http endpoint receives a list of
              changes, list of related Pull Request or a commit SHA.
            </p>
            <p>
              <strong>Decide about the status of Pull Request.</strong>
            </p>
          </>
        }
      />

      <Live />
      <Contact />
      <Footer />
    </div>
  );
}

export default Index;
