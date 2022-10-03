import { InspectorLogo, defineConfig } from '@theguild/components';

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
});
