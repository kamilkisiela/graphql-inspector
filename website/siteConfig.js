/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

const siteConfig = {
  title: 'GraphQL Inspector',
  tagline:
    'Compare schemas, validate documents, find breaking changes, find similar types, schema coverage',
  url: 'https://graphql-inspector.com',
  baseUrl: '/',

  // Used for publishing and more
  projectName: 'graphql-inspector',
  organizationName: 'kamilkisiela',

  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [
    {doc: 'index', label: 'Docs'},
    {href: '/install', label: 'Install'},
    {
      href: 'https://github.com/kamilkisiela/graphql-inspector',
      label: 'GitHub',
    },
  ],

  headerIcon: 'img/logo.svg',
  footerIcon: 'img/logo-gray.svg',
  favicon: 'img/favicon/favicon.png',

  colors: {
    primaryColor: '#4b5ff7',
    secondaryColor: '#B23D32',
  },

  scripts: [
    'https://buttons.github.io/buttons.js',
    'https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js',
    '/js/code-block-buttons.js',
    '/js/scroll-to.js',
    '/js/drift.js',
  ],

  stylesheets: ['https://fonts.googleapis.com/css?family=Lato:300,400,700,900'],

  copyright: `Copyright © ${new Date().getFullYear()} Kamil Kisiela`,

  highlight: {
    theme: 'atom-one-dark',
  },

  usePrism: true,

  // On page navigation for the current documentation page.
  onPageNav: 'separate',
  // No .html extensions for paths.
  cleanUrl: true,

  // Stats
  gaTrackingId: 'UA-125180910-2',

  // Open Graph and Twitter card images.
  ogImage: 'img/og-image.png',
  twitterImage: 'img/og-image.png',

  // Show documentation's last contributor's name.
  enableUpdateBy: true,

  // Show documentation's last update time.
  enableUpdateTime: true,

  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
  repoUrl: 'https://github.com/kamilkisiela/graphql-inspector',
  editUrl:
    'https://github.com/kamilkisiela/graphql-inspector/edit/master/docs/',
};

module.exports = siteConfig;
