/* eslint-disable react-hooks/rules-of-hooks */

/* eslint sort-keys: error */
import { useRouter } from 'next/router';
import { defineConfig, Giscus, useTheme } from '@theguild/components';

export default defineConfig({
  docsRepositoryBase: 'https://github.com/kamilkisiela/graphql-inspector/tree/master/website', // base URL for the docs repository
  main({ children }) {
    const { resolvedTheme } = useTheme();
    const { route } = useRouter();

    const comments = route !== '/' && (
      <Giscus
        // ensure giscus is reloaded when client side route is changed
        key={route}
        repo="kamilkisiela/graphql-inspector"
        repoId="MDEwOlJlcG9zaXRvcnkxNTc3NzY4MjQ="
        category="Docs Discussions"
        categoryId="DIC_kwDOCWd7uM4CSDVl"
        mapping="pathname"
        theme={resolvedTheme}
      />
    );
    return (
      <>
        {children}
        {comments}
      </>
    );
  },
  siteName: 'INSPECTOR',
});
