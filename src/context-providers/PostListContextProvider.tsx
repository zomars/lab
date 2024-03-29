import { graphql, useStaticQuery } from 'gatsby';
import React, { ReactElement } from 'react';

import { IPostListContext, PostListContext } from '../react-contexts/post-list-state.context';
import { IBlogPost, IUniquePostTag } from '../types/common.types';

interface IPostTagsMappingQResponse {
  allPosts: {
    posts: IBlogPost[];
  };
  uniqueTags: {
    tags: IUniquePostTag[];
  };
}

export const postsQuery = graphql`query Posts {
  allPosts: allMdx(
    filter: {frontmatter: {published: {ne: false}}}
    sort: {frontmatter: {date: DESC}}
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
    tags: group(field: {frontmatter: {tags: SELECT}}) {
      name: fieldValue
      count: totalCount
    }
  }
}`;

function usePostsAndTags(): IPostTagsMappingQResponse {
  return useStaticQuery(postsQuery);
}

/**
 * Create context data structure from graphQL response.
 * So that we can memoize it.
 */
function useComputedContextValue(): IPostListContext {
  const {
    allPosts: { posts },
    uniqueTags: { tags },
  } = usePostsAndTags();

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
export function PostListContextProvider(
  { children }: { children: ReactElement },
): ReactElement {
  const context = useComputedContextValue();

  return (
    <PostListContext.Provider
      value = { context }
    >
      { children }
    </PostListContext.Provider>
  );
}
