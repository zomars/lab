import React, { ReactElement } from 'react';
import { Link } from 'gatsby';
import { cn } from '@bem-react/classname';
import { classnames } from '@bem-react/classnames';

import { IBlogPost } from '../../types/common.types';

import './PostPreview.scss';

const cnPostPreview = cn('PostPreview');

/**
 * Return post date, reading time and list of tags.
 */
function getDetailsString(post: IBlogPost): string {
  const { date } = post.frontmatter;
  const { text, words } = post.fields.readingTime;

  const details = [
    date,
    text,
    `${words} words`,
  ];

  return details.join(' — ');
}

/**
 * Return post tags as text.
 */
function getPostTags(post: IBlogPost): string {
  const { tags } = post.frontmatter;

  return tags.map((tag: string) => `#${tag}`).join(' ');
}

export class PostPreview extends React.Component<{
  className?: string,
  post: IBlogPost,
  tag: string,
}> {
  public render(): ReactElement {
    const {
      post,
      className,
      tag,
    } = this.props;

    const { slug } = post.fields;
    const { title } = post.frontmatter;

    // so that we have active tag info in the runtime
    // for the PostPage prev/next links
    const blogPostLinkPayload = {
      activeTag: tag,
    };

    return (
      <div
        className = { classnames(cnPostPreview(), className) }
      >
        <p className = { cnPostPreview('Details') }>
          { getPostTags(post) }
        </p>
        <h3 className = { cnPostPreview('Header') }>
          <Link
            to = { slug }
            state = { blogPostLinkPayload }
          >
            { title }
          </Link>
        </h3>
        <p
          className = { cnPostPreview('Details') }
        >
          { getDetailsString(post) }
        </p>
        <p
          dangerouslySetInnerHTML = {{ __html: post.excerpt! }}
        />
        <p>
          <Link
            to = { slug }
            state = { blogPostLinkPayload }
          >
            Read more
          </Link>
        </p>
      </div>
    );
  }
}
