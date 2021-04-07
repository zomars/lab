/** @jsx jsx */

import React, { ReactElement } from 'react';
import { Link } from 'gatsby';
import { Styled, jsx } from 'theme-ui';
import { cn } from '@bem-react/classname';
import classnames from 'classnames';

import { IBlogPost } from '../../types/common.types';

import './PostPreview.scss';

const cnPostPreview = cn('PostPreview');

/**
 * Return post date, reading time and list of tags.
 */
function getDetailsString(post: IBlogPost): string {
  const { date, tags } = post.frontmatter;
  const { text, words } = post.fields.readingTime;

  const details = [
    date,
    text,
    `${words} words`,
    tags.map((tag: string) => `#${tag}`).join(' '),
  ];

  return details.join(' — ');
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
        <Styled.h3>
          <Styled.a
            as = { Link }
            to = { slug }
            state = { blogPostLinkPayload }
          >
            { title }
          </Styled.a>
        </Styled.h3>
        <Styled.p
          sx = {{
            marginBottom: 2,
            color: 'textMuted',
          }}
        >
          { getDetailsString(post) }
        </Styled.p>
        <Styled.p
          dangerouslySetInnerHTML = {{ __html: post.excerpt! }}
          sx = {{
            marginBottom: 1,
          }}
        />
        <Styled.p>
          <Styled.a
            as = { Link }
            to = { slug }
            state = { blogPostLinkPayload }
          >
            Read more
          </Styled.a>
        </Styled.p>
      </div>
    );
  }
}
