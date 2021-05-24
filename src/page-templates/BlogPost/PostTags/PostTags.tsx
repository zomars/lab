/**
 * @jsx h
 * @jsxFrag Fragment
 **/

import { h, VNode, Fragment } from 'preact';
import { Link } from 'gatsby';
import { cn } from '@bem-react/classname';

import { getPostListUrlByTag } from '../../../services/urls.service';
import './PostTags.scss';

const cnPostTags = cn('PostTags');

export function PostTags(props: {
  tags: string[],
  activeTag?: string,
}): VNode {
  const { tags, activeTag } = props;

  const tagElements = tags.sort().map((tag: string) => {
    const className = tag === activeTag ?
      cnPostTags('Link', { active: true }) : '';

    return (
      <Link
        key = { tag }
        className = { className }
        to = { getPostListUrlByTag(tag) }
      >
        #{ tag }&nbsp;
      </Link>
    );
  });

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{ tagElements }</>;
}
