import {
  GatsbyImage,
  getImage,
  IGatsbyImageData,
} from 'gatsby-plugin-image';
import { MDXRenderer } from 'gatsby-plugin-mdx';
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
  const { date: posted, updated } = post.frontmatter;
  const { text } = post.fields.readingTime;

  let date = posted;

  if (updated) {
    date += ` (updated ${ updated })`;
  }

  const details = [
    date,
    text,
    // `${words} words`,
  ];

  return details.join(' — ');
}

export function PostPreview(props: {
  className?: string;
  testId?: string;
  post: IBlogPost;
  tag: string;
}): ReactElement {
  const {
    post,
    className,
    tag,
  } = props;

  const { slug } = post.fields;
  const { title, coverImage, summary } = post.frontmatter;

  // so that we have active tag info in the runtime
  // for the PostPage prev/next links
  const blogPostLinkPayload = {
    activeTag: tag,
  };

  let CoverImage = null;

  if (coverImage) {
    const imageData = getImage(coverImage.childImageSharp) as IGatsbyImageData;

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

  const { testId } = props;

  return (
    <div
      className = { classnames(cnPostPreview(), className) }
      data-testid = {
        classnames(
          cnPostPreview({ withImage: !!coverImage }),
          testId,
        )
      }
    >
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
          data-testid = { cnPostPreview('Details') }
        >
          { getDetailsString(post) }
        </p>

        <Link
          data-testid = { cnPostPreview('Excerpt') }
          className = { cnPostPreview('Excerpt') }
          to = { slug }
          state = { blogPostLinkPayload }
        >
          { summary ? <MDXRenderer>{ summary }</MDXRenderer> : <p> { post.excerpt! } </p>}
        </Link>

        { CoverImage }
      </div>
    </div>
  );
}
