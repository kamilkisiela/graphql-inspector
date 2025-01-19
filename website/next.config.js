import { withGuildDocs } from '@theguild/components/next.config';

export default withGuildDocs({
  output: 'export',
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
      '/docs/essentials/diff': '/docs/commands/diff',
      '/docs/essentials/coverage': '/docs/commands/coverage',
      '/docs/essentials/validate': '/docs/commands/validate',
      '/docs/essentials/similar': '/docs/commands/similar',
      '/docs/essentials/audit': '/docs/commands/audit',
      '/docs/essentials/introspect': '/docs/commands/introspect',
    }).map(([from, to]) => ({
      source: from,
      destination: to,
      permanent: true,
    })),
});
