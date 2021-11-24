import * as path from 'path';
import { CreatePagesArgs } from 'gatsby';

import { IBlogPost } from '../types/common.types';

export const postsQuery = /* GraphQL */ `
  query GatsbyNode {
    allPosts: allMdx(
      filter: {
        frontmatter: {
          published: { ne: false }
        }
      }
      sort: { fields: [frontmatter___date], order: DESC }
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

const blogPostComponentPath = path.resolve(
  './src/page-templates/BlogPost/BlogPost.tsx',
);

export async function createPostPages(
  { graphql, actions: { createPage } }: CreatePagesArgs,
): Promise<void> {
  const postsReq = await graphql(postsQuery);

  if (postsReq.errors) {
    throw postsReq.errors;
  }

  // eslint-disable-next-line no-extra-parens
  const { nodes: posts }: { nodes: IBlogPost[] } = (postsReq.data as any).allPosts;

  posts.forEach((post) => {
    const { slug: path } = post.fields;

    createPage({
      path,
      component: blogPostComponentPath,
      context: {
        slug: path,
      },
    });
  });
}
