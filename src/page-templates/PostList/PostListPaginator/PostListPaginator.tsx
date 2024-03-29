import { classnames } from '@bem-react/classnames';
import {
  Pagination,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React, { ReactElement } from 'react';
import { cn } from '@bem-react/classname';
import { navigate } from 'gatsby';

import { getPostListUrlByTag } from '../../../services/get-post-list-url-by-tag';

import './PostListPaginator.scss';

const cnPostListPaginator = cn('PostListPaginator');

export function PostListPaginator(props: {
  current: number;
  length: number;
  tag: string;
  className?: string;
}): ReactElement {
  const { current, length, tag } = props;

  function onPageSelection(
    event: unknown,
    page: number,
  ): void {
    navigate(getPostListUrlByTag(tag, page));
  }

  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <Pagination
      className = { classnames(cnPostListPaginator(), props.className) }
      siblingCount = { isLargeScreen ? 2 : 1 }
      color = 'primary'
      page = { current }
      showFirstButton = { isLargeScreen }
      showLastButton = { isLargeScreen }
      count = { length }
      onChange = { onPageSelection }
    />
  );
}
