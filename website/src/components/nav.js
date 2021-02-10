import React from 'react';
import Link from '@docusaurus/Link';
import {GitHub, Twitter, Linkedin} from 'react-feather';

export const Nav = ({link}) => {
  return (
    <div id="main-nav">
      <a href="/" className="logo">
        <img src="/img/logo.svg" alt="GraphQL Inspector Logo" />
      </a>
      <div className="links">
        <Link to={link.to} title={link.title}>
          {link.label}
        </Link>
        <div className="sep" />
        <Link to="/docs" title="GraphQL Inspector - Documentation">
          Documentation
        </Link>
        <div className="sep" />
        <a
          href="#contact-us"
          title="GraphQL Inspector - Contact us"
          className="scroll-to"
        >
          Contact Us
        </a>
        <div className="social-links">
          <a
            href="https://github.com/kamilkisiela/graphql-inspector"
            title="GitHub Repository"
          >
            <GitHub />
          </a>
          <a href="https://twitter.com/kamilkisiela" title="Twitter Profile">
            <Twitter />
          </a>
          <a
            href="https://www.linkedin.com/company/the-guild-software"
            title="LinkedIn Profile"
          >
            <Linkedin />
          </a>
        </div>
      </div>
    </div>
  );
};
