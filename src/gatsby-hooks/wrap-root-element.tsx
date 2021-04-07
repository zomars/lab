import React, { ReactElement, ReactNode, useMemo } from 'react';
import { graphql, StaticQuery, WrapRootElementBrowserArgs } from 'gatsby';

import { IPostContext, postsContext } from '../react-contexts/posts.context';
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
 * Create context data structure from graphQL response.
 * So that we can memoize it.
 */
function computeContextValue(
  posts: IBlogPost[],
  tags: IUniquePostTag[],
): IPostContext {
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

  return {
    posts: postsMap,
    postsPerTag,
  };
}

/**
 * Populate postsContext with data.
 */
function PostContextProvider(
  { data, children }: { data: IQueryResponse, children: ReactElement },
): ReactElement {
  const { posts } = data.allPosts;
  const { tags } = data.uniqueTags;

  const memoizedValue = useMemo(
    () => computeContextValue(posts, tags),
    [posts, tags],
  );

  return (
    <postsContext.Provider
      value = { memoizedValue }
    >
      { children }
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
      render = { data => (
        <PostContextProvider
          data = { data }
        >
          { element as ReactElement }
        </PostContextProvider>
      ) }
    />
  );
}
