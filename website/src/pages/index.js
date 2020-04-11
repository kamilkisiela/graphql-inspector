import React from 'react';
import Link from '@docusaurus/Link';
import Head from '@docusaurus/Head';
import BrowserOnly from '@docusaurus/BrowserOnly';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Footer from '@theme/Footer';
import ContactForm from '../components/contact';
import {Loading} from '../components/loading';

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
        <Link to="/docs">Docs</Link>
        <div className="sep" />
        <a href="/install">Install</a>
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

const Highlights = () => {
  return (
    <div id="main-highlights">
      <div className="container">
        <Hightlight
          title="GitHub integration"
          image="/img/ui/features/github.svg"
          description="Have a per-repository, self-hosted GraphQL Inspector service or deploy it with Docker."
        />
        <Hightlight
          title="Compare GraphQL schemas"
          image="/img/ui/features/diff.svg"
          description="Detects every change (neutral, dangerous or breaking)."
        />
        <Hightlight
          title="Validate operations and fragments"
          image="/img/ui/features/validate.svg"
          description="Validates documents against a schema and looks for deprecated usage."
        />
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
        <title>{title} - {tagline}</title>
      </Head>
      <div className="mainContainer">
        <Nav />
        <Header />
      </div>
      <Highlights />
      <Live />
      <Contact />
      <Footer />
    </div>
  );
}

export default Index;
