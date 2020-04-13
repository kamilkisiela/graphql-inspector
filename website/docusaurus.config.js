module.exports = {
  title: 'GraphQL Inspector',
  tagline:
    'Compare schemas, validate documents, find breaking changes, find similar types, schema coverage',

  url: 'https://graphql-inspector.com',
  baseUrl: '/',
  favicon: 'img/favicon/favicon.png',

  organizationName: 'kamilkisiela',
  projectName: 'graphql-inspector',

  themeConfig: {
    disableDarkMode: true,
    sidebarCollapsible: false,
    image: 'img/github/app-action.jpg',
    announcementBar: {
      id: 'support_us',
      content: [
        '<strong>We are working on v2.0</strong>. Contribute to its <a target="_blank" rel="noopener noreferrer" href="https://github.com/kamilkisiela/graphql-inspector/issues/1371">roadmap</a> by suggesting features.',
        'If you like GraphQL Inspector give it a star on <a target="_blank" rel="noopener noreferrer" href="https://github.com/kamilkisiela/graphql-inspector/">GitHub</a>!',
      ].join(' '),
      backgroundColor: '#292d3e',
      textColor: '#bfc7d5',
    },
    navbar: {
      title: 'GraphQL Inspector',
      logo: {
        alt: 'GraphQL Inspector Logo',
        src: 'img/just-logo.svg',
      },
      links: [
        {
          to: '/docs/',
          activeBasePath: '/docs',
          label: 'Documentation',
          position: 'right',
        },
        {
          href: '/install',
          label: 'Install',
          position: 'right',
        },
        {
          href: 'https://github.com/kamilkisiela/graphql-inspector',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `Copyright © ${new Date().getFullYear()} Kamil Kisiela. All rights reserved.`,
      logo: {
        alt: 'GraphQL Inspector Logo',
        src: 'img/logo-white.svg',
      },
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Introduction',
              to: 'docs/index',
            },
            {
              label: 'Essentials',
              to: 'docs/essentials/diff',
            },
            {
              label: 'Recipes',
              to: 'docs/recipes/github',
            },
          ],
        },
        {
          title: 'Product',
          items: [
            {
              label: 'Command-Line',
              to: 'docs/essentials/diff',
            },
            {
              label: 'GitHub Application',
              to: 'docs/recipes/github',
            },
            {
              label: 'GitHub Action',
              to: 'docs/recipes/action',
            },
            {
              label: 'Continous Integration',
              to: 'docs/recipes/ci',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Discord',
              href: 'https://discord.gg/xud7bH9',
            },
            {
              label: 'Other projects',
              href: 'https://github.com/the-guild-org/Stack',
            },
            {
              label: 'Mailing List',
              href: 'https://upscri.be/19qjhi',
            },
            {
              label: 'Community Meetings',
              href: 'https://github.com/the-guild-org/community-meetings',
            },
          ],
        },
        {
          title: 'Social',
          items: [
            {
              label: 'Blog',
              href: 'https://medium.com/the-guild',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/kamilkisiela/graphql-inspector',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/kamilkisiela',
            },
            {
              label: 'LinkedIn',
              href: 'https://www.linkedin.com/company/the-guild-software'
            }
          ],
        },
      ],
    },
    googleAnalytics: {
      trackingID: 'UA-125180910-2',
    },
  },
  scripts: [
    {
      src: '/js/scroll-to.js',
      async: true,
      defer: true,
    },
    {
      src: '/js/drift.js',
      async: true,
      defer: true,
    },
  ],
  stylesheets: ['https://fonts.googleapis.com/css?family=Lato:300,400,700,900'],
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          path: 'docs',
          include: ['**/*.md', '**/*.mdx'],
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/kamilkisiela/graphql-inspector/edit/master/website/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        sitemap: {
          cacheTime: 600 * 1001, // 600 sec - cache purge period
          changefreq: 'weekly',
          priority: 0.5,
        },
      },
    ],
  ],
};
