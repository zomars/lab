import path from 'path';
import { CreatePageArgs } from 'gatsby';

import { postsPerPage, indexPageTag } from '../constants';

const postListComponentPath = path.resolve(
  './src/page-templates/PostList/PostList.tsx',
);

/**
 * Create index page out of first page of tech posts.
 */
export function createIndexPage(
  { actions: { createPage } }: CreatePageArgs,
): void {
  const pageSpec = {
    path: '/',
    component: postListComponentPath,
    context: {
      skip: 0,
      currentPage: 1,
      limit: postsPerPage,
      tag: indexPageTag,
    },
  };

  createPage(pageSpec);
}
