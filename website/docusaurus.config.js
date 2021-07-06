const path = require('path');

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
    colorMode: {
      defaultMode: 'light',
      disableSwitch: true,
    },
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
      items: [
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
    googleAnalytics: {
      trackingID: 'UA-125180910-2',
    },
  },
  scripts: [
    {
      src: '/js/scroll-to.js',
    },
    {
      src: '/js/force-dark.js',
    },
    'https://the-guild.dev/static/crisp.js'
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
    path.join(__dirname, '/plugins/monaco-editor')
  ],
};
