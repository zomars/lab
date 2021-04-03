import React, { ReactNode } from 'react';
import { Link } from 'gatsby';
import { Styled } from 'theme-ui';
import { cn } from '@bem-react/classname';

import { getPostListUrlByTag } from '../../../services/urls.service';
import './PostTags.scss';

const cnPostTags = cn('PostTags');

export class PostTags extends React.Component<{
  tags: string[],
  activeTag?: string,
}> {
  render(): ReactNode {
    const { tags, activeTag } = this.props;

    return tags.sort().map((tag: string) => {
      const className = tag === activeTag ?
        cnPostTags('Link', { active: true }) : '';

      return (
        <Styled.a
          as = { Link }
          key = { tag }
          className = {  className }
          to = { getPostListUrlByTag(tag) }
        >
          #{ tag }&nbsp;
        </Styled.a>
      );
    })
  }
}
