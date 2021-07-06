import { GatsbyImage, getImage, IGatsbyImageData } from 'gatsby-plugin-image';
import React, { ReactElement } from 'react';
import { Link } from 'gatsby';
import { cn } from '@bem-react/classname';
import { classnames } from '@bem-react/classnames';

import { PostTags } from '../PostTags/PostTags';
import { IBlogPost } from '../../types/common.types';

import './PostPreview.scss';

const cnPostPreview = cn('PostPreview');

/**
 * Return post date, reading time and list of tags.
 */
function getDetailsString(post: IBlogPost): string {
  const { date: posted, updated } = post.frontmatter;
  const { text, words } = post.fields.readingTime;

  let date = posted;

  if (updated) {
    date += ` (updated ${ updated })`;
  }

  const details = [
    date,
    text,
    `${words} words`,
  ];

  return details.join(' — ');
}

export function PostPreview(props: {
  className?: string,
  post: IBlogPost,
  tag: string,
}): ReactElement {
  const {
    post,
    className,
    tag,
  } = props;

  const { slug } = post.fields;
  const { title, tags, coverImage } = post.frontmatter;

  // so that we have active tag info in the runtime
  // for the PostPage prev/next links
  const blogPostLinkPayload = {
    activeTag: tag,
  };

  let CoverImage = null;

  if (coverImage) {
    const imageData = getImage(coverImage) as IGatsbyImageData;

    CoverImage = (
      <Link
        className = { cnPostPreview('ImageWrapper') }
        to = { slug }
        state = { blogPostLinkPayload }
      >
        <GatsbyImage
          data-testid = { cnPostPreview('Image') }
          imgClassName = { cnPostPreview('Image') }
          alt = { `Cover photo for ${ title } post` }
          loading = 'eager'
          image = { imageData }
        />
      </Link>
    );
  }

  return (
    <div
      className = { classnames(cnPostPreview(), className) }
      data-testid = { cnPostPreview({ withImage: !!coverImage }) }
    >
      <p>
        <PostTags
          tags = { tags }
          activeTag = { props.tag }
          noLinkForActiveTag = { true }
        />
      </p>

      <h3 className = { cnPostPreview('Header') }>
        <Link
          data-testid = { cnPostPreview('Header') }
          to = { slug }
          state = { blogPostLinkPayload }
        >
          { title }
        </Link>
      </h3>

      <div className = { cnPostPreview('PreviewWrapper') }>
        <p
          className = { cnPostPreview('Details') }
        >
          { getDetailsString(post) }
        </p>

        <Link
          data-testid = { cnPostPreview('Excerpt') }
          className = { cnPostPreview('Excerpt') }
          to = { slug }
          state = { blogPostLinkPayload }
        >
          <p dangerouslySetInnerHTML = {{ __html: post.excerpt! }}/>
        </Link>

        { CoverImage }
      </div>
    </div>
  );
}
