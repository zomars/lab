import React, { ReactNode } from 'react';
import { Link } from 'gatsby';
import { cn } from '@bem-react/classname';

import { getPostListUrlByTag } from '../../../services/urls.service';
import './PostTags.scss';

const cnPostTags = cn('PostTags');

export class PostTags extends React.Component<{
  tags: string[],
  activeTag?: string,
}> {
  public render(): ReactNode {
    const { tags, activeTag } = this.props;

    return tags.sort().map((tag: string) => {
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
  }
}
