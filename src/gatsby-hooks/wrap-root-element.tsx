import React, { ReactElement, ReactNode } from 'react';
import { graphql, StaticQuery, WrapRootElementBrowserArgs } from 'gatsby';
import {
  ThemeProvider,
} from '@material-ui/core/styles';

import { PostContextProvider } from '../components/PostContextProvider/PostContextProvider';
import { theme } from '../theme.mui';

export const postsQuery = graphql`
  query Posts {
    allPosts: allMdx(
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
