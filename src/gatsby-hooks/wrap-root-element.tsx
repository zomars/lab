import React, { ReactElement, ReactNode } from 'react';
import {
  graphql,
  StaticQuery,
  WrapRootElementBrowserArgs,
} from 'gatsby';

import {
  ThemeProvider,
} from '@mui/material/styles';

import { PostContextProvider } from '../components/PostContextProvider/PostContextProvider';
import { theme } from '../theme/theme.mui';

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

/**
 * Set up postsContext for all nested elements.
 */
export function wrapRootElement(
  { element }: WrapRootElementBrowserArgs,
): ReactNode {
  return (
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
  );
}
