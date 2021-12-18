import path from 'path';
import { ProvidePlugin } from 'webpack';

import {
  CreateNodeArgs,
  CreatePageArgs,
  CreatePagesArgs,
  CreateSchemaCustomizationArgs,
  CreateWebpackConfigArgs,
  Node,
} from 'gatsby';

import { createFilePath } from 'gatsby-source-filesystem';

import { createPostPages } from './src/gatsby-hooks/create-post-pages';
import { createPostIndexPages } from './src/gatsby-hooks/create-post-list-pages';
import { createIndexPage } from './src/gatsby-hooks/create-index-page';

/**
 * Make preact Fragment globally available.
 */
export function onCreateWebpackConfig(
  { actions }: CreateWebpackConfigArgs,
): void {
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
  if (
    node.internal.type === 'Mdx' ||
    node.ext === '.md' ||
    node.ext === '.mdx'
  ) {
    const { createNodeField } = actions;

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
  }
}

/**
 * Remove dummy index page from pages/index (required to get index.html created) and
 * replace with the first page of tech posts list.
 */
export function onCreatePage(args: CreatePageArgs): void {
  const { page } = args;

  if (page.path === '/') {
    const { deletePage } = args.actions;

    const indexPageComponentPath = path.resolve(
      './src/pages/index.tsx',
    );

    deletePage({
      path: '/',
      component: indexPageComponentPath,
    });

    createIndexPage(args);
  }
}

/**
 * Define frontmatter schema manually wo inferring.
 */
export function createSchemaCustomization(
  { actions, createContentDigest }: CreateSchemaCustomizationArgs,
): void {
  const { createTypes, createFieldExtension } = actions;

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
      summary: String @stringToMdx,
      description: String,
    }
  `;

  createFieldExtension({
    name: 'stringToMdx',
    extend() {
      return {
        type: 'String',
        resolve(
          source: Node,
          args: unknown,
          context: unknown,
          info: Record<string, any>,
        ) {
          const value = source[info.fieldName] as string;
          const mdxType = info.schema.getType('Mdx');
          const { resolve } = mdxType.getFields().body;

          if (!value) {
            return value;
          }

          return resolve(
            {
              rawBody: value,
              internal: {
                type: 'String',
                contentDigest: createContentDigest(value),
              },
            },
            args,
            context,
            info,
          );
        },
      };
    },
  });

  createTypes(typeDefs);
}
