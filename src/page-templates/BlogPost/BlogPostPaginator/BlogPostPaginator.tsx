import { cn } from '@bem-react/classname';
import React, { ReactElement } from 'react';

import { useAdjacentPosts } from '../../../hooks/usePostsContext.hook';
import { IBlogPost } from '../../../types/common.types';
import {
  AdjacentPostType,
  BlogPostPaginatorLink,
} from './BlogPostPaginatorLink/BlogPostPaginatorLink';

import './BlogPostPaginator.scss';

const cnBlogPostPaginator = cn('BlogPostPaginator');

interface IBlogPostPaginatorProps {
  post: IBlogPost,
  tag: string,
}

/**
 * Render link to previous and next posts under the post body.
 */
export function BlogPostPaginator(props: IBlogPostPaginatorProps): ReactElement {
  const {
    tag,
    post,
  } = props;

  const { slug } = post.fields;

  const [
    previousPost,
    nextPost,
  ] = useAdjacentPosts(slug, tag);

  return (
    <ul
      className = { cnBlogPostPaginator() }
    >
      { previousPost ?
        <BlogPostPaginatorLink
          type = { AdjacentPostType.prev }
          slug = { previousPost.fields.slug }
          title = { previousPost.frontmatter.title }
          tag = { tag }
        /> : null }

      { nextPost ?
        <BlogPostPaginatorLink
          type = { AdjacentPostType.next }
          slug = { nextPost.fields.slug }
          title = { nextPost.frontmatter.title }
          tag = { tag }
        /> : null }
    </ul>
  );
}
