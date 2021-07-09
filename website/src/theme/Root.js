import React from 'react';
import { ThemeProvider, GlobalStyles, Header, FooterExtended } from '@theguild/components';

// Default implementation, that you can customize
function Root({ children }) {
  return (
    <ThemeProvider>
      <GlobalStyles includeFonts />
      <Header activeLink={'/open-source'} accentColor="var(--ifm-color-primary)" />
      {children}
      <FooterExtended resources={[
        {
          children: 'Introduction',
          title: 'Get started',
          href: '/docs/index',
        },
        {
          children: 'Essentials',
          title: 'Learn about Essentials',
          href: '/docs/essentials/diff',
        },
        {
          children: 'Recipes',
          title: 'Learn about Recipes',
          href: '/docs/recipes/environments',
        },
        {
          children: 'Products',
          title: 'Learn about Products',
          href: '/docs/products/github',
        },
      ]}/>
    </ThemeProvider>
  );
}

export default Root;