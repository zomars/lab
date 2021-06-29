import React, { ReactElement } from 'react';
import { graphql, PageRendererProps } from 'gatsby';
import { cn } from '@bem-react/classname';
import { MDXRenderer } from 'gatsby-plugin-mdx';

import { Layout } from '../../components/Layout';
import { Seo } from '../../components/Seo';
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

        <MDXRenderer>{ post.body! }</MDXRenderer>

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
