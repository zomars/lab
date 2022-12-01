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
        internal {
          contentFilePath
        }
        frontmatter {
          galleryImages {
            title
            caption
            image: path {
              childImageSharp {
                preview: gatsbyImageData(
                  layout: FULL_WIDTH,
                  webpOptions: {
                    quality: 90
                  }
                )
              }
            }
          }
        }
      }
    }
  }
`;

const postComponentPath = path.resolve(
  './src/page-templates/Post/Post.tsx',
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
      component: `${ postComponentPath }?__contentFilePath=${ post.internal.contentFilePath }`,
      context: {
        slug: path,
        // MDX renderer needs some frontmatter stuff to be passed via pageContext
        frontmatter: post.frontmatter,
      },
    });
  });
}
