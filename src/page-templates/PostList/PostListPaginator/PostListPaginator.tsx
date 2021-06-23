import { classnames } from '@bem-react/classnames';
import React, { ReactElement } from 'react';
import { cn } from '@bem-react/classname';
import { Pagination } from '@material-ui/lab';
import { navigate } from 'gatsby';

import { getPostListUrlByTag } from '../../../services/urls.service';

import './PostListPaginator.scss';

const cnPostListPaginator = cn('PostListPaginator');

export function PostListPaginator(props: {
  current: number,
  length: number,
  tag: string,
  className?: string,
}): ReactElement {
  const { current, length, tag } = props;

  function onPageSelection(
    event: unknown,
    page: number,
  ): void {
    navigate(getPostListUrlByTag(tag, page));
  }

  return (
    <Pagination
      className = { classnames(cnPostListPaginator(), props.className) }
      siblingCount = { 2 }
      color = 'primary'
      page = { current }
      showFirstButton = { true }
      showLastButton = { true }
      count = { length }
      onChange = { onPageSelection }
    />
  );
}
