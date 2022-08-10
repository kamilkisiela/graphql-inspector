import Script from 'next/script';
import { AppProps } from 'next/app';
import { FooterExtended, Header, ThemeProvider } from '@theguild/components';
import { useGoogleAnalytics } from 'guild-docs';
import 'guild-docs/style.css';

export default function App({ Component, pageProps, router }: AppProps) {
  const analytics = useGoogleAnalytics({ router, trackingId: 'G-HQTC95CPEL' });
  return (
    <ThemeProvider>
      <Script async src="https://the-guild.dev/static/crisp.js" />
      <Script {...analytics.loadScriptProps} />
      <Script {...analytics.configScriptProps} />
      <Header
        accentColor="#1cc8ee"
        themeSwitch
        searchBarProps={{ version: 'v2' }}
      />
      <Component {...pageProps} />
      <FooterExtended />
    </ThemeProvider>
  );
}

// const defaultSeo: AppSeoProps = {
//   title: 'GraphQL Inspector',
//   description: `Validate schemas and detect changes. Receive schema change notifications. Keep Operations and Fragments consistent.`,
//   logo: {
//     url: 'https://graphql-inspector.com/assets/subheader-logo.png',
//     width: 50,
//     height: 54,
//   },
// };
