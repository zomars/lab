import React, { ReactNode } from 'react';
import { graphql, StaticQuery, WrapRootElementBrowserArgs } from 'gatsby';

import { postsContext } from '../react-contexts/posts.context';
import { IBlogPost, IUniquePostTag } from '../types/common.types';

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

interface IQueryResponse {
  allPosts: {
    posts: IBlogPost[],
  },
  uniqueTags: {
    tags: IUniquePostTag[],
  },
}

/**
 * Populate postsContext with data.
 */
function staticQueryRender(
  element: ReactNode,
  queryData: IQueryResponse,
): ReactNode {
  const { posts } = queryData.allPosts;
  const { tags } = queryData.uniqueTags;

  const postsMap = new Map(
    posts.map(post => [post.fields.slug, post])
  );

  const postsPerTag = new Map();

  tags.forEach(({ name: tag }) => {
    const tagPosts = posts.filter(({ frontmatter: { tags } }) => {
      return tags.includes(tag);
    });

    postsPerTag.set(tag, tagPosts);
  });

  const contextValue = {
    posts: postsMap,
    postsPerTag,
  };

  return (
    <postsContext.Provider
      value = { contextValue }
    >
      { element }
    </postsContext.Provider>
  );
}

/**
 * Set up postsContext for all nested elements.
 */
export function wrapRootElement(
  { element }: WrapRootElementBrowserArgs,
): ReactNode {
  return (
    <StaticQuery
      query = { postsQuery }
      render = { data => staticQueryRender(element, data) }
    />
  );
}
