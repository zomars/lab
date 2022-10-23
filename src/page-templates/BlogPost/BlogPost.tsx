import { cn } from '@bem-react/classname';
import { MDXProvider } from '@mdx-js/react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { graphql, PageRendererProps } from 'gatsby';
import React, { ReactElement } from 'react';
import { CodeSnippet } from '../../components/CodeSnippet/CodeSnippet';
import { ImageGrid } from '../../components/ImageGrid/ImageGrid';

import { Layout } from '../../components/Layout';
import {
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
} from '../../components/MDXHeader/MDXHeader';
import { Note } from '../../components/Note/Note';
import { PostDateDetails } from '../../components/PostDateDetails/PostDateDetails';
import { PostEventDetails } from '../../components/PostEventDetails/PostEventDetails';
import { PostTags } from '../../components/PostTags/PostTags';
import { Seo } from '../../components/Seo/Seo';
import { VideoPlayer } from '../../components/VideoPlayer/VideoPlayer';
import { IBlogPost } from '../../types/common.types';

import './BlogPost.scss';
import { BlogPostPaginator } from './BlogPostPaginator/BlogPostPaginator';

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
        date(formatString: "l")
        updated(formatString: "l")
        tags
        title
        description
        event {
          date(formatString: "l")
          locationAddress
          locationName
        }
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
  Note,
  VideoPlayer,
  ImageGrid,
};

interface IGqlResponse {
  post: IBlogPost;
}

interface IBlogPostTemplateProps extends PageRendererProps {
  data: IGqlResponse;
  children: ReactElement[];
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
      children,
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
      event,
    } = post.frontmatter;

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

          <p className = { cnBlogPost('Details') }>
            <PostDateDetails
              publishedDate = { posted }
              updatedDate = { updated }
            />
            { event ?
              <PostEventDetails
                date = { event.date }
                locationName = { event.locationName }
                locationAddress = { event.locationAddress }
              /> : null }
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
              components = { mdxComponents as unknown as any }
            >
              { children }
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
