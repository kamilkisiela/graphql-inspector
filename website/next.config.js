import { withGuildDocs } from '@theguild/components/next.config';

export default withGuildDocs({
  eslint: {
    ignoreDuringBuilds: true,
  },
  redirects: () =>
    Object.entries({
      '/install': '/docs/introduction/installation',
      '/enterprise': '/docs/introduction',
      '/docs/index': '/docs',
      '/products': '/docs/products/ci',
    }).map(([from, to]) => ({
      source: from,
      destination: to,
      permanent: true,
    })),
});
