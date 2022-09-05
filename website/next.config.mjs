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
    ],
  })
);
