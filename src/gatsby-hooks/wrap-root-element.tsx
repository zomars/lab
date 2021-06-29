import React, { ReactElement, ReactNode } from 'react';
import { graphql, StaticQuery, WrapRootElementBrowserArgs } from 'gatsby';
import { MDXProvider } from '@mdx-js/react';
import {
  ThemeProvider,
} from '@material-ui/core/styles';

import { PostContextProvider } from '../components/PostContextProvider/PostContextProvider';
import { VideoPlayer } from '../components/VideoPlayer/VideoPlayer';
import { theme } from '../theme.mui';

export const postsQuery = graphql`
  query Posts {
    allPosts: allMdx(
      filter: {
        frontmatter: {
          published: { ne: false }
        }
      }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      posts: nodes {
        fields {
          slug
        }
        frontmatter {
          title
          tags
        }
      }
    }
    uniqueTags: allMdx {
      tags: group(field: frontmatter___tags) {
        name: fieldValue
        count: totalCount
      }
    }
  }
`;

const mdxComponents = {
  VideoPlayer,
};

/**
 * Set up postsContext for all nested elements.
 */
export function wrapRootElement(
  { element }: WrapRootElementBrowserArgs,
): ReactNode {
  return (
    <MDXProvider
      components = { mdxComponents }
    >
      <ThemeProvider theme = { theme }>
        <StaticQuery
          query = { postsQuery }
          render = { data => (
            <PostContextProvider
              data = { data }
            >
              { element as ReactElement }
            </PostContextProvider>
          ) }
        />
      </ThemeProvider>
    </MDXProvider>
  );
}
