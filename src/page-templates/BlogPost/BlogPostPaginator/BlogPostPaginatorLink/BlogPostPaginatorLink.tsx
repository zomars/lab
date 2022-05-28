import { Link } from 'gatsby';
import React, { ReactElement } from 'react';
import { cn } from '@bem-react/classname';

import './BlogPostPaginatorLink.scss';

export enum AdjacentPostType {
  prev = 'prev',
  next = 'next',
}

interface IBlogPostPaginatorLinkProps {
  type: AdjacentPostType;
  title: string;
  tag: string;
  slug: string;
}

const arrows = {
  [AdjacentPostType.next]: '\u2192',
  [AdjacentPostType.prev]: '\u2190',
};

const cnBlogPostPaginatorLink = cn('BlogPostPaginatorLink');

/**
 * Render link for the previous or following post based on tag and current post slug.
 */
export function BlogPostPaginatorLink(props: IBlogPostPaginatorLinkProps): ReactElement {
  const {
    type,
    title,
    tag,
    slug,
  } = props;

  const postLinkPayload = {
    activeTag: tag,
  };

  const labels = [
    arrows[type],
    title,
  ];

  if (type === AdjacentPostType.next) {
    labels.reverse();
  }

  return (
    <li
      className = {
        cnBlogPostPaginatorLink({ next: type === AdjacentPostType.next })
      }
    >
      <Link

        to = { slug }
        state = { postLinkPayload }
        rel = { type }
      >
        { labels.join(' ') }
      </Link>
    </li>
  );
}
