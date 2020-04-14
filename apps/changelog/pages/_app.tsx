import {AppProps} from 'next/App';
import {ThemeProvider, CSSReset} from '@chakra-ui/core';
import {Global, css} from '@emotion/core';

export default function App({Component, pageProps}: AppProps) {
  return (
    <ThemeProvider>
      <CSSReset />
      <Global
        styles={css`
          html,
          body {
            background-color: #fff;
            color: #111;
            height: 100%;
            box-sizing: border-box;
          }

          #__next {
            min-height: 100%;
          }

          body {
            position: relative;
            margin: 0;
            line-height: 1.65;
            font-size: 16px;
            font-weight: 400;
            min-width: 320px;
            min-height: 100%;
            direction: ltr;
            background-color: #fff;
            color: #000;
            scroll-behavior: smooth;

            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI';
          }
        `}
      />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
