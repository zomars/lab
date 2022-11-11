import {
  GatsbyImage,
  getImage,
  IGatsbyImageData,
} from 'gatsby-plugin-image';
import React, { ReactElement } from 'react';
import { Link } from 'gatsby';
import { cn } from '@bem-react/classname';
import { classnames } from '@bem-react/classnames';

import { IBlogPost } from '../../types/common.types';
import { PostPreviewDetails } from './PostPreviewDetails/PostPreviewDetails';

import './PostPreview.scss';

const cnPostPreview = cn('PostPreview');

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

  const {
    slug,
    readingTime: { text: readingTime },
  } = post.fields;

  const {
    title,
    coverImage,
    summary,
    date: published,
    updated,
    galleryImages: gridImageGroups,
  } = post.frontmatter;

  let gridImagesQuantity = 0;

  if (gridImageGroups) {
    gridImagesQuantity = gridImageGroups.flat(2).length;
  }

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
          objectFit = 'contain'
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
          testId)
      }
    >

      <div className = { cnPostPreview('Wrapper') }>
        <h3 className = { cnPostPreview('Header') }>
          <Link
            data-testid = { cnPostPreview('Header') }
            to = { slug }
            state = { blogPostLinkPayload }
          >
            { title }
          </Link>
        </h3>

        <p
          className = { cnPostPreview('Details') }
          data-testid = { cnPostPreview('Details') }
        >
          <PostPreviewDetails
            published = { published }
            updated = { updated }
            readingTime = { readingTime }
            gridImages = { gridImagesQuantity }
          />
        </p>

        <Link
          data-testid = { cnPostPreview('Excerpt') }
          className = { cnPostPreview('Excerpt') }
          to = { slug }
          state = { blogPostLinkPayload }
        >
          { summary || post.excerpt! }
        </Link>
      </div>

      { CoverImage }
    </div>
  );
}
