import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
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
import { Seo } from '../../components/Seo/Seo';
import { VideoPlayer } from '../../components/VideoPlayer/VideoPlayer';
import { IBlogPost } from '../../types/common.types';
import { PostTags } from '../../components/PostTags/PostTags';
import { CodeSnippet } from '../../components/CodeSnippet/CodeSnippet';
import { BlogPostPaginator } from './BlogPostPaginator/BlogPostPaginator';

import './BlogPost.scss';

const cnBlogPost = cn('BlogPost');

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    post: mdx(fields: { slug: { eq: $slug } }) {
      excerpt(pruneLength: 200)
      fields {
        slug
      }
      body
      frontmatter {
        date(formatString: "MMM DD, YYYY")
        updated(formatString: "MMM DD, YYYY")
        tags
        title
        description
        coverImage {
          childImageSharp {
            gatsbyImageData(height: 540)
          }
        }
      }
    }
  }
`;

const mdxComponents = {
  code: CodeSnippet,
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

  public render(): ReactElement {
    const {
      data,
      location,
    } = this.props;

    const {
      post,
    } = data;

    const {
      title,
      tags,
      date: posted,
      updated,
      coverImage,
      description,
    } = post.frontmatter;

    let date = posted;

    if (updated) {
      date = `Originally posted ${ date }. Last update - ${ updated }`;
    }

    let image = null;

    if (coverImage) {
      // eslint-disable-next-line no-extra-parens
      ({ fallback: image } = (coverImage as any).childImageSharp.gatsbyImageData.images);
    }

    return (
      <Layout
        className = { cnBlogPost() }
        testId = { cnBlogPost() }
      >
        <Seo
          title = { title }
          description = { description || post.excerpt }
          pathname = { location.pathname }
          image = { image }
        />

        <article>
          <h1
            data-testid = { cnBlogPost('Title') }
          >{ title }</h1>

          <p className = { cnBlogPost('Date') }>
            { date }
          </p>

          <p>
            <PostTags
              tags = { tags }
              activeTag = { this.activeTag }
            />
          </p>

          <section
            data-testid = { cnBlogPost('Body') }
          >
            <MDXProvider
              components = { mdxComponents }
            >
              <MDXRenderer>{ post.body! }</MDXRenderer>
            </MDXProvider>
          </section>
        </article>

        <hr className = { cnBlogPost('BottomLine') }/>

        <BlogPostPaginator
          post = { post }
          tag = { this.activeTag }
        />
      </Layout>
    );
  }
}

// eslint-disable-next-line import/no-default-export
export default BlogPostTemplate;
