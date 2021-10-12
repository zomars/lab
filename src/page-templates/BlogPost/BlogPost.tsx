import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';
import React, { ReactElement } from 'react';
import { graphql, PageRendererProps } from 'gatsby';
import { cn } from '@bem-react/classname';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import { MDXProvider } from '@mdx-js/react';

import { Layout } from '../../components/Layout';
import {
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
} from '../../components/MDXHeader/MDXHeader';
import { Seo } from '../../components/Seo';
import { VideoPlayer } from '../../components/VideoPlayer/VideoPlayer';
import { IBlogPost } from '../../types/common.types';
import { PostTags } from '../../components/PostTags/PostTags';
import { BlogPostPaginator } from './BlogPostPaginator/BlogPostPaginator';

import './BlogPost.scss';

const cnBlogPost = cn('BlogPost');

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    post: mdx(fields: { slug: { eq: $slug } }) {
      fields {
        slug
      }
      body
      frontmatter {
        date(formatString: "MMM DD, YYYY")
        updated(formatString: "MMM DD, YYYY")
        tags
        title
      }
    }
  }
`;

const mdxComponents = {
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  table: Table,
  th: TableCell,
  thead: TableHead,
  tbody: TableBody,
  td: TableCell,
  tr: TableRow,
  VideoPlayer,
};

interface IGqlResponse {
  post: IBlogPost,
}

interface IBlogPostTemplateProps extends PageRendererProps {
  data: IGqlResponse,
}

export class BlogPostTemplate extends React.Component<IBlogPostTemplateProps> {
  public render(): ReactElement {
    const {
      data,
    } = this.props;

    const {
      post,
    } = data;

    const {
      title,
      tags,
      date: posted,
      updated,
    } = post.frontmatter;

    let date = posted;

    if (updated) {
      date = `Originally posted ${ date }. Last update - ${ updated }`;
    }

    return (
      <Layout
        className = { cnBlogPost() }
      >
        <Seo
          title = { title }
          description = { post.excerpt }
        />

        <h1>{ title }</h1>

        <p className = { cnBlogPost('Date') }>
          { date }
        </p>

        <p>
          <PostTags
            tags = { tags }
            activeTag = { this.activeTag }
          />
        </p>

        <MDXProvider
          components = { mdxComponents }
        >
          <MDXRenderer>{ post.body! }</MDXRenderer>
        </MDXProvider>

        <hr className = { cnBlogPost('BottomLine') }/>

        <BlogPostPaginator
          post = { post }
          tag = { this.activeTag }
        />
      </Layout>
    );
  }

  /**
   * Return current post active tag.
   */
  private get activeTag(): string {
    const { props } = this;
    const { state } = props.location;
    const { tags } = props.data.post.frontmatter;

    // eslint-disable-next-line no-extra-parens
    return (state as Record<string, string>)?.activeTag || tags[0];
  }
}

// eslint-disable-next-line import/no-default-export
export default BlogPostTemplate;
