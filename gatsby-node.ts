import * as path from 'path';
import {
  CreateNodeArgs,
  CreatePagesArgs,
} from 'gatsby';

import { createFilePath } from 'gatsby-source-filesystem';

import { INode } from './src/types/gatsby-node';

const postsQuery = /* GraphQL */ `
  query GatsbyNode {
    allMdx(
      sort: { fields: [frontmatter___date], order: DESC }
      limit: 1000
    ) {
      nodes {
        fields {
          slug
        }
        frontmatter {
          title
        }
      }
    }
  }
`;

const blogPostPath = path.resolve('./src/templates/BlogPost/BlogPost.tsx');

export function createPages(
  { graphql, actions }: CreatePagesArgs,
) {
  const {
    createPage,
    createRedirect,
  } = actions;

  createRedirect({
    fromPath: '/blog',
    toPath: '/',
    redirectInBrowser: true,
    isPermanent: true,
  })

  return graphql(postsQuery)
    .then(result => {
      if (result.errors) {
        throw result.errors;
      }

      // Create blog posts pages.
      const { nodes: posts }: { nodes: INode[] } = (result.data as any).allMdx;

      posts.forEach((post, index: number) => {
        const previous = index === posts.length - 1 ? null : posts[index + 1];
        const next = index === 0 ? null : posts[index - 1];

        createPage({
          path: (post as INode).fields.slug,
          component: blogPostPath,
          context: {
            slug: (post as INode).fields.slug,
            previous,
            next
          }
        });
      });
    });
}

export function onCreateNode(
  { node, actions, getNode }: CreateNodeArgs
) {
  const { createNodeField } = actions;

  if (
    node.internal.type === 'Mdx'
    || node.ext === '.md'
    || node.ext === '.mdx'
  ) {
    const value = createFilePath({
      node,
      getNode
    });

    createNodeField({
      name: 'slug',
      node,
      value
    });
  }
}
