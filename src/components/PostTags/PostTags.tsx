/**
 * @jsx h
 * @jsxFrag Fragment
 **/

import { h, VNode, Fragment } from 'preact';
import { Link } from 'gatsby';
import { cn } from '@bem-react/classname';

import { getPostListUrlByTag } from '../../services/urls.service';
import './PostTags.scss';

const cnPostTags = cn('PostTags');

interface IPostTagsProps {
  tags: string[],
  activeTag?: string,
  textOnly?: boolean,
}

export function PostTags(props: IPostTagsProps): VNode {
  const { tags, activeTag, textOnly } = props;

  const tagElements = tags.sort().map((tag: string) => {
    const className =
      cnPostTags('Tag', {
        active: tag === activeTag,
        link: !textOnly,
      });

    const testId = cnPostTags('Tag');

    const label = `#${ tag } `;

    const commonProps = {
      className,
      'data-testid': testId,
      key: tag,
    };

    if (textOnly) {
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
  });

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{ tagElements }</>;
}
