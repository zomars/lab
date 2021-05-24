import React, { ReactElement } from 'react';
import { Link } from 'gatsby';
import { cn } from '@bem-react/classname';

import { getPostListUrlByTag } from '../../../services/urls.service';

import './PostListPaginator.scss';

const cnPostListPaginator = cn('PostListPaginator');
const cnListElement = cnPostListPaginator('ListElement');

/**
 * Returns anchor element wrapped in "li".
 */
function getListLink(
  tag: string,
  page: number,
  label = `${page}`,
  rel?: string,
): ReactElement {
  return (
    <li
      className = { cnListElement }
      key = { label }
    >
      <Link
        to = { getPostListUrlByTag(tag, page) }
        rel = { rel || undefined }
      >
        { label }
      </Link>
    </li>
  );
}

export function PostListPaginator(props: {
  current: number,
  length: number,
  tag: string,
}): ReactElement {
  const { current, length, tag } = props;
  const delta = 3;

  const from = Math.max(1, current - delta);
  const to = Math.min(length, current + delta);

  const listElements = [];

  // sibling pages (numbers)
  for (let page = from; page <= to; page++) {
    if (page !== current) {
      listElements.push(
        getListLink(tag, page),
      );
    } else {
      listElements.push(
        <li
          className = { cnListElement }
          key = { page }
        >
          { page }
        </li>
      );
    }
  }

  if (current !== 1) {
    listElements.unshift(
      getListLink(tag, 1, 'First'),
      getListLink(tag, current - 1, 'Previous', 'prev'),
    );
  }

  if (current < length) {
    listElements.push(
      getListLink(tag, current + 1, 'Next', 'next'),
      getListLink(tag, length, 'Last'),
    );
  }

  return (
    <nav className = { cnPostListPaginator('Nav') }>
      <ul className = { cnPostListPaginator('List') }>
        { listElements }
      </ul>
    </nav>
  );
}
