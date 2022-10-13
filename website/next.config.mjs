import { withGuildDocs } from '@theguild/components/next.config';

export default withGuildDocs({
  eslint: {
    ignoreDuringBuilds: true,
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
});
