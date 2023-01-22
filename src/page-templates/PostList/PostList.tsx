import React, { ReactElement } from 'react';
import { graphql, PageRendererProps } from 'gatsby';
import { cn } from '@bem-react/classname';

import { HtmlHead } from '../../components/HtmlHead/HtmlHead';
import { Layout } from '../../components/Layout';
import { PostPreview } from '../../components/PostPreview/PostPreview';
import { IBlogPost } from '../../types/common.types';
import { postsPerPage } from '../../constants';
import { PostListPaginator } from './PostListPaginator/PostListPaginator';

import './PostList.scss';

export const postsQuery = graphql`query blogListQuery($skip: Int!, $limit: Int!, $tag: String!) {
  onePageOfPosts: allMdx(
    filter: {frontmatter: {published: {ne: false}, tags: {in: [$tag]}}}
    sort: {frontmatter: {date: DESC}}
    limit: $limit
    skip: $skip
  ) {
    totalCount
    posts: nodes {
      excerpt(pruneLength: 400)
      fields {
        slug
        readingTime {
          text
        }
      }
      frontmatter {
        date(formatString: "MMM DD, YYYY")
        updated(formatString: "MMM DD, YYYY")
        tags
        title
        coverImage {
          childImageSharp {
            gatsbyImageData(height: 300, placeholder: BLURRED)
          }
        }
        galleryImages {
          title
        }
        summary
      }
    }
  }
}`;

interface IGqlResponse {
  onePageOfPosts: {
    posts: IBlogPost[];
    totalCount: number;
  };
}

interface IPostListPageContext {
  tag: string;
  currentPage: number;
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

export function Head(props: IPostListProps): ReactElement {
  const { data, pageContext } = props;
  const { posts } = data.onePageOfPosts;

  let seoImage;

  for (const post of posts) {
    if (post.frontmatter.coverImage) {
      seoImage = post.frontmatter.coverImage.childImageSharp;

      break;
    }
  }

  return (
    <HtmlHead
      title = { `All #${ pageContext.tag } posts, page ${ pageContext.currentPage }` }
      keywords = { keywords }
      pathname = { props.location.pathname }
      image = { seoImage }
    />
  );
}

export function PostList(props: IPostListProps): ReactElement {
  const { data, pageContext } = props;
  const { posts, totalCount } = data.onePageOfPosts;

  const postElements = posts.map(
    (post: IBlogPost) => (
      <PostPreview
        className = { cnPostList('PostPreview') }
        testId = { cnPostList('PostPreview') }
        tag = { pageContext.tag }
        post = { post }
        key = { post.fields.slug }
      />
    )
  );

  const totalPages = Math.ceil(totalCount / postsPerPage);

  const Paginator = totalPages > 1 ? (
    <PostListPaginator
      className = { cnPostList('Paginator') }
      current = { pageContext.currentPage }
      length = { totalPages }
      tag = { pageContext.tag }
    />
  ) : null;

  return (
    <Layout
      testId = { cnPostList() }
      className = { cnPostList() }
    >
      { postElements }

      { Paginator }
    </Layout>
  );
}

export default PostList;
