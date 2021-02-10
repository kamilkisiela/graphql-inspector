import React from 'react';
import {Redirect} from '@docusaurus/router';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

function Docs() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  const {title, tagline, url, favicon} = siteConfig;

  const ogImage = `${url}/img/github/app-action.jpg`;
  const siteTitle = `Documentation - ${title}`;

  return (
    <>
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
      <Redirect to="/docs/index" />
    </>
  );
}

export default Docs;
