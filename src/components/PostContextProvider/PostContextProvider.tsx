import React, { ReactElement, useMemo } from 'react';
import { IPostContext, postsContext } from '../../react-contexts/posts.context';
import {
  IBlogPost,
  IPostTagsMappingQResponse,
  IUniquePostTag,
} from '../../types/common.types';

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
export function PostContextProvider(
  { data, children }: { data: IPostTagsMappingQResponse; children: ReactElement },
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
