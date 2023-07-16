import { withGuildDocs } from '@theguild/components/next.config';

export default withGuildDocs({
  eslint: {
    ignoreDuringBuilds: true,
  },
  redirects: () =>
    Object.entries({
      '/install': '/docs/installation',
      '/enterprise': '/docs',
      '/docs/index': '/docs',
      '/products': '/docs/products/ci',
      '/docs/recipies/github': '/docs/products/github',
      '/docs/api': '/docs/api/schema',
      '/docs/recipes': '/docs/recipes/environments',
      '/docs/recipes/github': '/docs/recipes/pull-requests',
      '/docs/essentials': '/docs/commands/diff',
    }).map(([from, to]) => ({
      source: from,
      destination: to,
      permanent: true,
    })),
});
