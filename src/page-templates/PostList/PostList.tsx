import React, { ReactElement } from 'react';
import { graphql, PageRendererProps } from 'gatsby';
import { cn } from '@bem-react/classname';

import { Layout } from '../../components/Layout';
import { SEO } from '../../components/seo';
import { PostPreview } from '../../components/PostPreview/PostPreview';
import { IBlogPost } from '../../types/common.types';
import { postsPerPage } from '../../constants';
import { PostListPaginator } from './PostListPaginator/PostListPaginator';

import './PostList.scss';

export const postsQuery = graphql`
  query blogListQuery($skip: Int!, $limit: Int!, $tag: String!) {
    onePagePosts: allMdx(
      filter: { frontmatter: { tags: { in: [$tag] } } }
      sort: { fields: [frontmatter___date], order: DESC }
      limit: $limit
      skip: $skip
    ) {
      totalCount
      posts: nodes {
        excerpt(pruneLength: 400)
        fields {
          slug,
          readingTime {
            text,
            words,
          }
        }
        frontmatter {
          date(formatString: "MMM DD, YYYY")
          tags
          title
        }
      }
    }
  }
`;

interface IGqlResponse {
  onePagePosts: {
    posts: IBlogPost[],
    totalCount: number,
  },
}

interface IPostListPageContext {
  tag: string,
  currentPage: number,
}

interface IPostListProps extends PageRendererProps {
  data: IGqlResponse;
  pageContext: IPostListPageContext;
}

const keywords = [
  'blog',
  'gatsby',
  'javascript',
  'react',
];

const cnPostList = cn('PostList');

export function PostList(props: IPostListProps): ReactElement {
  const { data, pageContext } = props;
  const { posts, totalCount } = data.onePagePosts;

  const postElements = posts.map(
    (post: IBlogPost) => (
      <PostPreview
        className = { cnPostList('PostPreview') }
        tag = { pageContext.tag }
        post = { post }
        key = { post.fields.slug }
      />
    )
  );

  const numPages = Math.ceil(totalCount / postsPerPage);

  return (
    <Layout>
      <SEO
        title = { `All #${pageContext.tag} posts` }
        keywords = { keywords }
      />

      { postElements }

      <PostListPaginator
        current = { pageContext.currentPage }
        length = { numPages }
        tag = { pageContext.tag }
      />
    </Layout>
  );
}

// eslint-disable-next-line import/no-default-export
export default PostList;
