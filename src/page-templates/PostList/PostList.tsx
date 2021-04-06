import React, { ReactElement } from 'react';
import { graphql, PageRendererProps } from 'gatsby';

import { Layout } from '../../components/Layout';
import { SEO } from '../../components/seo';
import { PostPreview } from '../../components/PostPreview/PostPreview';
import { IBlogPost } from '../../types/common.types';
import { PostListPaginator } from './PostListPaginator/PostListPaginator';

export const postsQuery = graphql`
  query blogListQuery($skip: Int!, $limit: Int!, $tag: String!) {
    onePagePosts: allMdx(
      filter: { frontmatter: { tags: { in: [$tag] } } }
      sort: { fields: [frontmatter___date], order: DESC }
      limit: $limit
      skip: $skip
    ) {
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
  onePagePosts: { posts: IBlogPost[] },
}

interface IPostListPageContext {
  tag: string,
  numPages: number,
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

export class PostList extends React.Component<IPostListProps> {
  public render(): ReactElement {
    const { data, pageContext } = this.props;
    const { posts } = data.onePagePosts;

    const postElements = posts.map(
      (post: IBlogPost) => <PostPreview
        tag = { pageContext.tag }
        post = { post }
        key = { post.fields.slug }
      />
    );

    return (
      <Layout>
        <SEO
          title = { `All #${pageContext.tag} posts` }
          keywords = { keywords }
        />

        { postElements }

        <PostListPaginator
          current = { pageContext.currentPage }
          length = { pageContext.numPages }
          tag = { pageContext.tag }
        />
      </Layout>
    );
  }
}

// eslint-disable-next-line import/no-default-export
export default PostList;
