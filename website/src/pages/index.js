import React from 'react';
import Link from '@docusaurus/Link';
import Head from '@docusaurus/Head';
import BrowserOnly from '@docusaurus/BrowserOnly';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Footer from '@theme/Footer';
import ContactForm from '../components/contact';
import {Loading} from '../components/loading';
import {Feature} from '../components/feature';
import {Highlights} from '../components/highlights';

const LiveContent = () => {
  const Diff = React.lazy(() => import('../components/diff'));

  return (
    <ErrorBoundary>
      <React.Suspense fallback={<Loading color="#fff" height="300px" />}>
        <Diff />
      </React.Suspense>
    </ErrorBoundary>
  );
};

const Live = () => {
  return (
    <div className="live">
      <div className="live-wrapper">
        <BrowserOnly>{() => <LiveContent />}</BrowserOnly>
      </div>
    </div>
  );
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {hasError: false};
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return {hasError: true};
  }

  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Fallback
      return <span>Something went wrong.</span>;
    }

    return this.props.children;
  }
}

const Contact = () => {
  return (
    <div id="contact-us">
      <div id="main-header">
        <div className="container">
          <h1>
            <span>Contact us!</span>
          </h1>
          <h2>
            Need help? Want to start using GraphQL Inspector? We would love to
            help you and hear how you use GraphQL Inspector today!
          </h2>
          <div className="contact-wrapper">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
};

const Nav = () => {
  return (
    <div id="main-nav">
      <a href="" className="logo">
        <img src="/img/logo.svg" alt="GraphQL Inspector Logo" />
      </a>
      <div className="links">
        <Link to="/docs">Documentation</Link>
        <div className="sep" />
        <a href="/install">App</a>
        <div className="sep" />
        <a href="/action">Action</a>
        <div className="sep" />
        <a href="https://github.com/kamilkisiela/graphql-inspector">GitHub</a>
        <div className="sep" />
        <a href="#contact-us" className="scroll-to">
          Contact
        </a>
      </div>
    </div>
  );
};

const Header = () => {
  return (
    <div id="main-header">
      <div className="container">
        <h1>
          <span>Bulletproof</span> your GraphQL API
        </h1>
        <h2>
          Detects every change, finds similar or duplicated types, validates
          documents against a schema and looks for deprecated usage.
        </h2>
        <Link to="/docs">Start to Inspect</Link>
      </div>
    </div>
  );
};

const Hightlight = (props) => {
  return (
    <div className="highlight">
      <img src={props.image} alt={props.title} />
      <div className="title">{props.title}</div>
      <div className="description">{props.description}</div>
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
        <Nav />
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
            link: <Link to="/docs/products/github">Learn more</Link>,
          },
          {
            title: 'Continous Integrations',
            text: (
              <p>
                GraphQL Inspector can be used in any Continous Integration
                service.Use our modularized, CI suited version of CLI.
              </p>
            ),
            link: <Link to="/docs/products/ci">Learn more</Link>,
          },
          {
            title: 'Command-Line',
            text: (
              <p>
                <strong>GraphQL Inspector offers a CLI</strong> that lets you
                analyze your GraphQL API but also client-side applications.
              </p>
            ),
            link: <Link to="/docs/essentials/diff">Lean more</Link>,
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
              <a href="https://github.com/kamilkisiela/graphql-inspector">
                Visit repository
              </a>
            ),
          },
        ]}
      />

      <Feature
        img={
          <img
            src="/img/ui/features/annotations.png"
            alt="Annotations"
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
          <img src="/img/ui/features/notifications.png" alt="Notifications" />
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
        img={<img src="/img/ui/features/schema-check.png" alt="Schema Check" />}
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
        img={<img src="/img/ui/features/intercept.svg" alt="Intercept changes via HTTP" />}
        title="Intercept via HTTP"
        text={
          <>
            <p>
              On every schema checking, your http endpoint receives a list of
              changes, list of related Pull Request or a commit SHA.
            </p>
            <p>
              <strong>
                Decide about the status of Pull Request.
              </strong>
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
