import { withGuildDocs } from 'guild-docs/next.config';
import { applyUnderscoreRedirects } from 'guild-docs/underscore-redirects';
import withVideos from 'next-videos';

export default withGuildDocs(
  withVideos({
    basePath: process.env.NEXT_BASE_PATH && process.env.NEXT_BASE_PATH !== '' ? process.env.NEXT_BASE_PATH : undefined,
    experimental: {
      images: {
        unoptimized: true, // doesn't work with `next export`
        allowFutureImage: true,
      },
    },
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
    redirects: () =>
      Object.entries({
        '/install': '/docs/introduction/installation',
        '/docs': '/docs/introduction',
        '/enterprise': '/docs/introduction',
        '/docs/installation': '/docs/introduction/installation',
        '/docs/index': '/docs/introduction',
        '/products': '/docs/products/ci',
        '/docs/recipies/github': '/docs/products/github',
        '/docs/installation': '/docs/introduction/installation',
        '/docs/api': '/docs/api/schema',
        '/docs/recipes': '/docs/recipes/environments',
        '/docs/recipes/github': '/docs/recipes/pull-requests',
        '/docs/essentials': '/docs/essentials/diff',
      }).map(([from, to]) => ({
        source: from,
        destination: to,
        permanent: true,
      })),
  })
);
