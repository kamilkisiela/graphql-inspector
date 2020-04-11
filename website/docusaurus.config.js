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
          position: 'right'
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
      copyright: `Copyright © ${new Date().getFullYear()} Kamil Kisiela`,
      logo: {
        alt: 'GraphQL Inspector Logo',
        src: 'img/logo-gray.svg',
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
    }, {
      src: '/js/drift.js',
      async: true,
      defer: true,
    }
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
