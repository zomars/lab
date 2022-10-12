import { ProvidePlugin } from 'webpack';
import readingTime from 'reading-time';

import {
  CreateNodeArgs,
  CreatePageArgs,
  CreatePagesArgs,
  CreateSchemaCustomizationArgs,
  CreateWebpackConfigArgs,
} from 'gatsby';

import { createFilePath } from 'gatsby-source-filesystem';
import StatoscopeWebpackPlugin from '@statoscope/webpack-plugin';

import { createPostPages } from './src/gatsby-hooks/create-post-pages';
import { createPostIndexPages } from './src/gatsby-hooks/create-post-list-pages';
import { createIndexPage } from './src/gatsby-hooks/create-index-page';

/**
 * Make preact Fragment globally available.
 */
export function onCreateWebpackConfig(
  { stage, actions }: CreateWebpackConfigArgs,
): void {
  const plugins: Array<ProvidePlugin | StatoscopeWebpackPlugin> = [];

  plugins.push(
    new ProvidePlugin({
      // wo it I'm getting Fragment is not defined error
      // even when it is in fact defined
      Fragment: ['preact', 'Fragment'],
    }),
  );

  if (stage === 'build-javascript') {
    const report = {
      id: 'highlights',
      title: 'List of highlight modules',
      view: [
        {
          data: `
            #.stats.compilations.modules.sort(size desc)
              .[name.match('highlight')]
              .({ name, size: size/1024 })
          `,
          view: 'table',
          item: 'module-item',
        },
      ],
    };

    plugins.push(
      new StatoscopeWebpackPlugin({
        name: 'amlab',
        saveReportTo: './public/statoscope-report-[name].html',
        saveStatsTo: './public/statoscope-stats-[name].json',
        normalizeStats: true,
        saveOnlyStats: false,
        open: false,
        reports: [report],
      }),
    );
  }

  actions.setWebpackConfig({
    plugins,
    resolve: {
      alias: {
        react: 'preact/compat',
        'react-dom/test-utils': 'preact/test-utils',
        'react-dom': 'preact/compat',
        'react/jsx-runtime': 'preact/jsx-runtime',
      },
    },
  });
}

/**
 * Create post lists and post pages themselves.
 */
export async function createPages(hookArgs: CreatePagesArgs): Promise<void> {
  await createPostPages(hookArgs);

  await createPostIndexPages(hookArgs);
}

/**
 * Add slug to the post node.
 */
export function onCreateNode(
  { node, actions, getNode }: CreateNodeArgs
): void {
  const { createNodeField } = actions;

  if (node.internal.type === 'Mdx') {
    let path = createFilePath({
      node,
      getNode,
    });

    const folders = path.split('/');
    const { length } = folders;

    // strip away duplicated paths when post folder name matches the markdown file name
    // last part is always an empty string due to the trailing slash
    if (length > 3 && folders[length - 2] === folders[length - 3]) {
      path = `${ folders.slice(0, -2).join('/') }/`;
    }

    createNodeField({
      name: 'slug',
      node,
      value: path,
    });

    createNodeField({
      name: 'readingTime',
      node,
      value: readingTime(node.body as string),
    });
  }
}

/**
 * Remove dummy index page from pages/index (required to get index.html created) and
 * replace with the first page of tech posts list.
 */
export function onCreatePage(args: CreatePageArgs): void {
  const { deletePage, createPage } = args.actions;

  const { page } = args;

  if (page.path === '/') {
    deletePage({
      path: '/',
      component: page.component,
    });

    createIndexPage(args);

    return;
  }

  let { path } = page;

  const folders = path.split('/');
  const { length } = folders;

  // strip away duplicated component/folder names for static pages
  if (length > 2 && folders[length - 2] === folders[length - 3]) {
    path = `${ folders.slice(0, -2).join('/') }/`;

    deletePage({
      path: page.path,
      component: page.component,
    });

    createPage({
      path,
      component: page.component,
      context: {},
    });
  }
}

/**
 * Define frontmatter schema manually wo inferring.
 */
export function createSchemaCustomization(
  { actions }: CreateSchemaCustomizationArgs,
): void {
  const { createTypes } = actions;

  // should match IBlogPostFrontmatter interface
  const typeDefs = `
    type Mdx implements Node {
      frontmatter: MdxFrontmatter
    }
    type MdxFrontmatter @dontInfer {
      title: String!,
      date: Date! @dateformat,
      updated: Date @dateformat,
      tags: [String!],
      coverImage: File @fileByRelativePath,
      published: Boolean,
      summary: String,
      description: String,
    }
  `;

  createTypes(typeDefs);
}
