import { defineConfig, Giscus, InspectorLogo, useTheme } from '@theguild/components';
import { useRouter } from 'next/router';

const SITE_NAME = 'GraphQL Inspector';

export default defineConfig({
  titleSuffix: ` – ${SITE_NAME}`,
  docsRepositoryBase: 'https://github.com/kamilkisiela/graphql-inspector/tree/master/website', // base URL for the docs repository
  logo: (
    <>
      <InspectorLogo className="mr-1.5 h-9 w-9" />
      <div>
        <h1 className="md:text-md text-sm font-medium">{SITE_NAME}</h1>
        <h2 className="hidden text-xs sm:!block">Bulletproof your GraphQL</h2>
      </div>
    </>
  ),
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content={`${SITE_NAME}: documentation`} />
      <meta name="og:title" content={`${SITE_NAME}: documentation`} />
    </>
  ),
  main: {
    extraContent() {
      const { resolvedTheme } = useTheme();
      const { route } = useRouter();

      if (route === '/') {
        return null;
      }
      return (
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
    },
  },
});
