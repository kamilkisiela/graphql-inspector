import React from 'react';
import { ThemeProvider, GlobalStyles, Header, FooterExtended } from '@theguild/components';

if (typeof window !== 'undefined') {
  if (localStorage.getItem('theme') === 'dark') {
    localStorage.setItem('theme', 'light');
    document.documentElement.setAttribute('data-theme', 'light')
  }
}


// Default implementation, that you can customize
function Root({ children }) {
  return (
    <ThemeProvider>
      <GlobalStyles includeFonts />
      <Header activeLink={'/open-source'} accentColor="var(--ifm-color-primary)" />
      {children}
      <FooterExtended resources={[
        {
          children: 'Command-Line',
          title: 'Learn about our CLI',
          href: '/docs/essentials/diff',
        },
        {
          children: 'GitHub Application',
          title: 'Learn about our GitHub Application',
          href: '/docs/products/github',
        },
        {
          children: 'GitHub Action',
          title: 'Learn about our GitHub Action',
          href: '/docs/products/action',
        },
        {
          children: 'Continous Integration',
          title: 'Learn how to use GraphQL Inspector in CI/CD',
          href: '/docs/products/ci',
        },
      ]}/>
    </ThemeProvider>
  );
}

export default Root;
