import { ProvidePlugin } from 'webpack';

import {
  Actions,
  CreateNodeArgs,
  CreatePagesArgs,
} from 'gatsby';

import { createFilePath } from 'gatsby-source-filesystem';

import { createPostPages } from './src/gatsby-hooks/create-post-pages';
import { createPostIndexPages } from './src/gatsby-hooks/create-post-list-pages';

/**
 * Make preact Fragment globally available.
 */
export function onCreateWebpackConfig({ actions }: { actions: Actions }): void {
  const plugins: ProvidePlugin[] = [];

  plugins.push(
    new ProvidePlugin({
      // wo it I'm getting Fragment is not defined error
      // even when it is in fact defined
      Fragment: ['preact', 'Fragment'],
    }),
  );

  actions.setWebpackConfig({
    plugins,
  });
}

/**
 * Create site level redirects.
 * More will be added by programmatic page creation later on.
 */
function createRedirects(hookArgs: CreatePagesArgs): void {
  const {
    createRedirect,
  } = hookArgs.actions;

  // TODO add backend redirects or duplicated page
  const rootRedirectFromPaths = [
    '',
    '/',
    '/blog',
    '/blog/',
  ];

  const rootRedirectToTarget = '/blog/tech/1';

  const redirectSettings = {
    toPath: rootRedirectToTarget,
    redirectInBrowser: true,
    isPermanent: true,
  };

  rootRedirectFromPaths
    .forEach((fromPath) => {
      createRedirect({
        ...redirectSettings,
        fromPath,
      });
    });
}

/**
 * Create post lists and post pages themselves.
 */
export async function createPages(hookArgs: CreatePagesArgs): Promise<void> {
  createRedirects(hookArgs);

  await createPostPages(hookArgs);

  await createPostIndexPages(hookArgs);
}

/**
 * Add slug to the post node.
 */
export function onCreateNode(
  { node, actions, getNode }: CreateNodeArgs
): void {
  if (
    node.internal.type === 'Mdx' ||
    node.ext === '.md' ||
    node.ext === '.mdx'
  ) {
    const { createNodeField } = actions;

    const value = createFilePath({
      node,
      getNode,
    });

    createNodeField({
      name: 'slug',
      node,
      value,
    });
  }
}
