import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
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
  const { date } = post.frontmatter;
  const { text, words } = post.fields.readingTime;

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
          image = { imageData }
        />
      </Link>
    );
  }

  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('sm'));

  const ReadMore = (
    <div className = { cnPostPreview('ReadMore') }>
      <Link
        data-testid = { cnPostPreview('ReadMore') }
        to = { slug }
        state = { blogPostLinkPayload }
      >
        Read more
      </Link>
    </div>
  );

  return (
    <div
      className = { classnames(cnPostPreview(), className) }
      data-testid = { cnPostPreview({ withImage: !!coverImage }) }
    >
      <p className = { cnPostPreview('Details') }>
        <PostTags
          tags = { tags }
          activeTag = { props.tag }
          textOnly = { true }
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
        <div
          className = { cnPostPreview('DetailsAndExcerpt') }
        >
          <p
            className = { cnPostPreview('Details') }
          >
            { getDetailsString(post) }
          </p>

          { isLargeScreen ? null : CoverImage }

          <p
            data-testid = { cnPostPreview('Excerpt') }
            dangerouslySetInnerHTML = {{ __html: post.excerpt! }}
          />

          { isLargeScreen ? ReadMore : null }
        </div>

        { isLargeScreen ? CoverImage : ReadMore }
      </div>
    </div>
  );
}
