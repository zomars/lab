import * as path from 'path';
import { CreatePagesArgs } from 'gatsby';

import { getPostListUrlByTag } from '../services/urls.service';
import { IBlogPost, IUniquePostTag } from '../types/common.types';
import { postsPerPage } from '../constants';

const postListComponentPath = path.resolve(
  './src/page-templates/PostList/PostList.tsx',
);

const postsQuery = /* GraphQL */ `
  query PostsListByTag($tag: String) {
    allPostsByTag: allMdx(
      filter: {
        frontmatter: {
          published: { ne: false }
          tags: { in: [$tag] }
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

export const postTagsQuery = /* GraphQL */ `
  query postTags {
    uniqueTags: allMdx {
      tags: group(field: frontmatter___tags) {
        name: fieldValue
        count: totalCount
      }
    }
  }
`;

interface IPostTagsQueryResponse {
  uniqueTags: {
    tags: IUniquePostTag[],
  }
}

function parseUniqueTagsResponse(
  { data: { uniqueTags: { tags } } }: { data: IPostTagsQueryResponse },
): IUniquePostTag[] {
  return tags;
}

/**
 * Create multiple (paginated) listing pages per post tag passed.
 */
async function createPostListPagesPerTag(
  { graphql, actions: { createPage, createRedirect } }: CreatePagesArgs,
  tag: string,
): Promise<void> {
  const postsReq = await graphql(postsQuery, { tag });

  if (postsReq.errors) {
    throw postsReq.errors;
  }

  // eslint-disable-next-line no-extra-parens
  const { nodes: posts }: { nodes: IBlogPost[] } = (postsReq.data as any).allPostsByTag;

  const numPages = Math.ceil(posts.length / postsPerPage);

  for (let page = 1; page <= numPages; page++) {
    const args = {
      path: getPostListUrlByTag(tag, page),
      component: postListComponentPath,
      context: {
        skip: (page - 1) * postsPerPage,
        limit: postsPerPage,
        currentPage: page,
        tag,
      },
    };

    createPage(args);

    // redirect to the first page when no page is provided
    createRedirect({
      fromPath: getPostListUrlByTag(tag),
      toPath: getPostListUrlByTag(tag, 1),
      redirectInBrowser: true,
      isPermanent: true,
    });
  }
}

/**
 * Create post index pages per every tag.
 */
export async function createPostIndexPages(
  args: CreatePagesArgs,
): Promise<void> {
  const tagsReq = await args.graphql(postTagsQuery) as { data: IPostTagsQueryResponse };
  const uniqueTags = parseUniqueTagsResponse(tagsReq);

  await Promise.all(
    uniqueTags.map(
      ({ name: tag }) => createPostListPagesPerTag(args, tag),
    ),
  );
}
