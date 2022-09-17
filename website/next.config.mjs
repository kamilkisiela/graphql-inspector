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
        '/install': '/docs',
        '/enterprise': '/docs',
        '/docs/installation': '/docs',
        '/docs/index': '/docs',
        '/products': '/docs/products/ci',
        '/docs/recipies/github': '/docs/products/github',
        '/docs/installation#cli': '/docs/introduction/installation',
      }).map(([from, to]) => ({
        source: from,
        destination: to,
        permanent: true,
      })),
  })
);
