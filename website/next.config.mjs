import { withGuildDocs } from 'guild-docs/next.config';

export default withGuildDocs({
  eslint: {
    ignoreDuringBuilds: true,
  },
  swcMinify: true,
  redirects: () => [
    {
      source: '/install',
      destination: 'https://github.com/apps/graphql-inspector',
      permanent: true,
    },
  ],
});
