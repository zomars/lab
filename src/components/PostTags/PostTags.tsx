import { Link } from 'gatsby';
import { cn } from '@bem-react/classname';
import React, { ReactElement } from 'react';

import { getPostListUrlByTag } from '../../services/urls.service';
import './PostTags.scss';

const cnPostTags = cn('PostTags');

interface IPostTagsProps {
  tags: string[],
  activeTag?: string,
  noLinkForActiveTag?: boolean,
}

function getTagElement(
  tag: string,
  activeTag?: string,
  noLinkForActiveTag?: boolean,
): ReactElement {
  const textElement = noLinkForActiveTag && tag === activeTag;

  const className =
    cnPostTags('Tag', {
      active: tag === activeTag,
      link: !textElement,
    });

  const testId = cnPostTags('Tag', {
    link: !textElement,
  });

  const label = `#${ tag } `;

  const commonProps = {
    className,
    'data-testid': testId,
    key: tag,
  };

  if (textElement) {
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
  const { tags, activeTag, noLinkForActiveTag = false } = props;

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
      return getTagElement(tag, activeTag, noLinkForActiveTag);
    });

  return <> { tagElements } </>;
}
