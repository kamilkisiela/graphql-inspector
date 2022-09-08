import { withGuildDocs } from 'guild-docs/next.config';
import { applyUnderscoreRedirects } from 'guild-docs/underscore-redirects';
import withVideos from 'next-videos';

export default withGuildDocs(
  withVideos({
    basePath: process.env.NEXT_BASE_PATH && process.env.NEXT_BASE_PATH !== '' ? process.env.NEXT_BASE_PATH : undefined,
    eslint: {
      ignoreDuringBuilds: true,
    },
    swcMinify: true,
    experimental: {
      images: {
        unoptimized: true,
        allowFutureImage: true,
      },
    },
    webpack(config, meta) {
      applyUnderscoreRedirects(config, meta);

      return config;
    },
    redirects: () => [
      {
        source: '/install',
        destination: 'https://github.com/apps/graphql-inspector',
        permanent: true,
      },
      {
        source: '/enterprise',
        destination: 'https://graphql-hive.com',
        permanent: true,
      },
      {
        source: '/docs/installation',
        destination: '/docs/introduction/installation',
        permanent: true,
      },
      {
        source: '/docs',
        destination: '/docs/introduction',
        permanent: true,
      },
      {
        source: '/docs/index',
        destination: '/docs/introduction',
        permanent: true,
      },
      {
        source: '/products',
        destination: '/docs/products/ci',
        permanent: true,
      },
      {
        source: '/docs/recipies/github',
        destination: '/docs/products/github',
        permanent: true,
      },
    ],
  })
);
