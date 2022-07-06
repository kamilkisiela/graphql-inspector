import { createRequire } from 'module';
import bundleAnalyzer from '@next/bundle-analyzer';
import { withGuildDocs } from '@guild-docs/server';
import { register } from 'esbuild-register/dist/node.js';
import { i18n } from './next-i18next.config.js';

const require = createRequire(import.meta.url);

register({ extensions: ['.ts', '.tsx'] });
const { getRoutes } = require('./routes.ts');

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer(
  withGuildDocs({
    i18n,
    getRoutes,
    webpack(config) {
      config.resolve.fallback = { ...config.resolve.fallback, module: false };
      return config;
    },
    async redirects() {
      return [
        {
          source: '/install',
          destination: 'https://github.com/apps/graphql-inspector',
          permanent: true,
        },
      ];
    },
  }),
);
