import { FC } from 'react';
import { appWithTranslation } from 'next-i18next';
import {
  extendTheme,
  theme as chakraTheme,
  useColorMode,
} from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';
import {
  AppSeoProps,
  CombinedThemeProvider,
  DocsPage,
  ExtendComponents,
  handlePushRoute,
} from '@guild-docs/client';
import { FooterExtended, Header, Subheader } from '@theguild/components';
import type { AppProps } from 'next/app';
import 'remark-admonitions/styles/infima.css';
import '../../public/style.css';

ExtendComponents({
  HelloWorld() {
    return <p>Hello World!</p>;
  },
});

const styles: typeof chakraTheme['styles'] = {
  global: (props) => ({
    body: {
      bg: mode('white', 'gray.850')(props),
    },
  }),
};

const accentColor = '#1cc8ee';

const theme = extendTheme({
  colors: {
    gray: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      850: '#1b1b1b',
      900: '#171717',
    },
    accentColor,
  },
  fonts: {
    heading: 'TGCFont, sans-serif',
    body: 'TGCFont, sans-serif',
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  styles,
});

const serializedMdx = process.env.SERIALIZED_MDX_ROUTES;
const mdxRoutes = { data: serializedMdx && JSON.parse(serializedMdx) };

const AppContent: FC<AppProps> = (appProps) => {
  const { Component, pageProps, router } = appProps;
  const isDocs = router.asPath.startsWith('/docs');
  const { colorMode } = useColorMode();
  const logoSrc =
    colorMode === 'light' ? 'subheader-logo.svg' : 'subheader-logo-w.svg';

  return (
    <>
      <Header accentColor={accentColor} activeLink="/open-source" themeSwitch />
      <Subheader
        activeLink={router.asPath}
        product={{
          title: 'GraphQL Inspector',
          description: 'Bulletproof your GraphQL',
          image: {
            src: `/assets/${logoSrc}`,
            alt: 'Docs',
          },
          onClick: (e) => handlePushRoute('/', e),
        }}
        links={[
          {
            children: 'Home',
            title: 'Read about GraphQL Inspector',
            href: '/',
            onClick: (e) => handlePushRoute('/', e),
          },
          {
            children: 'Enterprise',
            title: 'Enterprise - GraphQL Inspector',
            href: '/enterprise',
            onClick: (e) => handlePushRoute('/enterprise', e),
          },
          {
            children: 'Docs',
            title: 'View examples',
            href: '/docs/introduction',
            onClick: (e) => handlePushRoute('/docs/introduction', e),
          },
        ]}
        cta={{
          children: 'Get Started',
          title: 'Start using GraphQL Inspector',
          href: 'https://github.com/kamilkisiela/graphql-inspector',
          target: '_blank',
          rel: 'noopener noreferrer',
        }}
      />
      {isDocs ? (
        <DocsPage
          appProps={appProps}
          accentColor={accentColor}
          mdxRoutes={mdxRoutes}
        />
      ) : (
        <Component {...pageProps} />
      )}
      <FooterExtended />
    </>
  );
};

const AppContentWrapper = appWithTranslation(function TranslatedApp(appProps) {
  return <AppContent {...appProps} />;
});

const defaultSeo: AppSeoProps = {
  title: 'GraphQL Inspector',
  description: `Validate schemas and detect changes. Receive schema change notifications. Keep Operations and Fragments consistent.`,
  logo: {
    url: 'https://graphql-inspector.com/assets/subheader-logo.png',
    width: 50,
    height: 54,
  },
};

const App: FC<AppProps> = (appProps) => {
  return (
    <CombinedThemeProvider
      theme={theme}
      accentColor={accentColor}
      defaultSeo={defaultSeo}
    >
      <AppContentWrapper {...appProps} />
    </CombinedThemeProvider>
  );
};

export default App;
