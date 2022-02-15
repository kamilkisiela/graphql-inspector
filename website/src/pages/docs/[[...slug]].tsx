import Head from 'next/head';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { DocsContent, DocsTOC, MDXPage } from '@guild-docs/client';
import { MDXPaths, MDXProps } from '@guild-docs/server';
import { getRoutes } from '../../../routes';

export default MDXPage(function PostPage({
  content,
  TOC,
  MetaHead,
  BottomNavigation,
}) {
  return (
    <>
      <Head>{MetaHead}</Head>
      <DocsContent>{content}</DocsContent>
      <DocsTOC>
        <TOC />
        <BottomNavigation />
      </DocsTOC>
    </>
  );
});

export const getStaticProps: GetStaticProps = (ctx) => {
  return MDXProps(
    ({ readMarkdownFile, getArrayParam }) => {
      return readMarkdownFile('docs/', getArrayParam('slug'));
    },
    ctx,
    { getRoutes },
  );
};

export const getStaticPaths: GetStaticPaths = (ctx) => {
  return MDXPaths('docs', { ctx });
};
