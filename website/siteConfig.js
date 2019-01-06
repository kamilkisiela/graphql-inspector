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
    'Tooling for GraphQL. Compare schemas, validate documents, find breaking changes, find similar types, schema coverage',
  url: 'https://graphql-inspector.netlify.com',
  baseUrl: '/',

  // Used for publishing and more
  projectName: 'graphql-inspector',
  organizationName: 'kamilkisiela',

  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [{doc: 'index', label: 'Docs'}],

  headerIcon: 'img/docusaurus.svg',
  footerIcon: 'img/docusaurus.svg',
  favicon: 'img/favicon.png',

  colors: {
    primaryColor: '#2E8555',
    secondaryColor: '#205C3B',
  },

  copyright: `Copyright © ${new Date().getFullYear()} Kamil Kisiela`,

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks.
    theme: 'default',
  },

  // Add custom scripts here that would be placed in <script> tags.
  scripts: ['https://buttons.github.io/buttons.js'],

  // On page navigation for the current documentation page.
  onPageNav: 'separate',
  // No .html extensions for paths.
  cleanUrl: true,

  // Open Graph and Twitter card images.
  ogImage: 'img/docusaurus.png',
  twitterImage: 'img/docusaurus.png',

  // Show documentation's last contributor's name.
  enableUpdateBy: true,

  // Show documentation's last update time.
  enableUpdateTime: true,

  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
  repoUrl: 'https://github.com/kamilkisiela/graphql-inspector',
};

module.exports = siteConfig;
