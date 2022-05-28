import { Link } from 'gatsby';
import { cn } from '@bem-react/classname';
import React, { ReactElement, useContext } from 'react';

import { postsContext } from '../../react-contexts/posts.context';

import { getPostListUrlByTag } from '../../services/urls.service';
import './PostTags.scss';

const cnPostTags = cn('PostTags');

interface IPostTagsProps {
  tags: string[];
  activeTag?: string;
  noLinkForActiveTag?: boolean;
}

function getTagElement(
  tag: string,
  withLink: boolean,
  isActive: boolean,
): ReactElement {
  const className =
    cnPostTags('Tag', {
      active: isActive,
      link: withLink,
    });

  const testId = cnPostTags('Tag', {
    link: withLink,
  });

  const label = `#${ tag } `;

  const commonProps = {
    className,
    'data-testid': testId,
    key: tag,
  };

  if (!withLink) {
    return (
      <span
        { ...commonProps }
      >
        { label }
      </span>
    );
  }

  return (
    // eslint-disable-next-line react/jsx-key
    <Link
      { ...commonProps }
      to = { getPostListUrlByTag(tag) }
    >
      { label }
    </Link>
  );
}

export function PostTags(props: IPostTagsProps): ReactElement {
  const {
    tags,
    activeTag,
    noLinkForActiveTag = false,
  } = props;

  const posts = useContext(postsContext);

  const sortedTags = tags.sort();

  if (activeTag) {
    const activeTagPosition = tags.indexOf(activeTag);

    if (activeTagPosition !== -1) {
      sortedTags.splice(activeTagPosition, 1);
      sortedTags.unshift(activeTag);
    }
  }


  const tagElements = sortedTags
    .map((tag: string) => {
      const isActive = tag === activeTag;

      let withLink = posts.postsPerTag.get(tag)!.length > 1;

      if (isActive && noLinkForActiveTag) {
        withLink = false;
      }

      return getTagElement(tag, withLink, isActive);
    });

  return <> { tagElements } </>;
}
