module.exports = {
  title: 'GraphQL Inspector',
  tagline:
    'Validate schemas, detect changes, receive schema change notifications on Slack and Discord. Validate documents, find similar types, get schema coverage.',

  url: 'https://graphql-inspector.com',
  baseUrl: '/',
  favicon: 'img/favicon/favicon.png',

  organizationName: 'kamilkisiela',
  projectName: 'graphql-inspector',

  themeConfig: {
    disableDarkMode: true,
    sidebarCollapsible: true,
    image: 'img/github/app-action.jpg',
    announcementBar: {
      id: 'support_us',
      content: [
        '<strong>We are working on v3.0</strong>. Contribute to its <a target="_blank" rel="noopener noreferrer" href="https://github.com/kamilkisiela/graphql-inspector/discussions/1371">roadmap</a> by suggesting features.',
        'If you like GraphQL Inspector give it a star on <a target="_blank" rel="noopener noreferrer" href="https://github.com/kamilkisiela/graphql-inspector/">GitHub</a> and <a target="_blank" rel="noopener noreferrer" href="https://github.com/sponsors/kamilkisiela">consider supporting the project</a>!',
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
          to: '/docs',
          activeBasePath: '/docs',
          label: 'Documentation',
          position: 'right',
        },
        {
          to: '/enterprise',
          label: 'Enterprise',
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
              to: 'docs/recipes/notifications',
            },
            {
              label: 'Products',
              to: 'docs/products/github',
            },
          ],
        },
        {
          title: 'Products',
          items: [
            {
              label: 'Command-Line',
              to: 'docs/essentials/diff',
            },
            {
              label: 'GitHub Application',
              to: 'docs/products/github',
            },
            {
              label: 'GitHub Action',
              to: 'docs/products/action',
            },
            {
              label: 'Continous Integration',
              to: 'docs/products/ci',
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
              href: 'https://the-guild.dev',
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
              href: 'https://the-guild.dev/blog',
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
              href: 'https://www.linkedin.com/company/the-guild-software',
            },
          ],
        },
      ],
    },
    googleAnalytics: {
      trackingID: 'UA-125180910-2',
    },
    algolia: {
      apiKey: 'c81d6a17b6d40971f230c0d79b03ff23',
      indexName: 'graphql-inspector',
      algoliaOptions: {},
    },
  },
  scripts: [
    {
      src: '/js/scroll-to.js',
    },
    {
      src: 'https://the-guild.dev/static/banner.js',
      async: true,
      defer: true,
    },
  ],
  stylesheets: [
    'https://fonts.googleapis.com/css?family=Lato:300,400,700,900&display=swap',
  ],
  presets: [
    [
      require.resolve('@docusaurus/preset-classic'),
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
  plugins: [
    [
      require.resolve('@docusaurus/plugin-ideal-image'),
      {
        size: 800,
        max: 800,
        min: 200,
        quality: 100,
      },
    ],
  ],
};
