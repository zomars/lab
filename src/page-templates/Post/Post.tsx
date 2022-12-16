import React, { ReactElement } from 'react';
import { graphql, PageRendererProps } from 'gatsby';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import { MDXProvider } from '@mdx-js/react';
import { cn } from '@bem-react/classname';

import { Layout } from '../../components/Layout';
import {
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
} from '../../components/MdxHeader/MdxHeader';
import { CodeSnippet } from '../../components/CodeSnippet/CodeSnippet';
import { HtmlHead } from '../../components/HtmlHead/HtmlHead';
import { ImageGrid } from '../../components/ImageGrid/ImageGrid';
import { MdxLink } from '../../components/MdxLink/MdxLink';
import { Note } from '../../components/Note/Note';
import { PostDateDetails } from '../../components/PostDateDetails/PostDateDetails';
import { PostEventDetails } from '../../components/PostEventDetails/PostEventDetails';
import { PostTags } from '../../components/PostTags/PostTags';
import { VideoPlayer } from '../../components/VideoPlayer/VideoPlayer';
import { IBlogPost } from '../../types/common.types';
import { Lightbox } from '../../components/Lightbox/Lightbox';
import { PostSideMenu } from '../../components/PostSideMenu/PostSideMenu';
import { BlogPostPaginator } from './BlogPostPaginator/BlogPostPaginator';

import './Post.scss';

const cnBlogPost = cn('Post');

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
            gatsbyImageData(layout: FIXED, width: 920)
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
  a: MdxLink,
};

interface IGqlResponse {
  post: IBlogPost;
}

interface IBlogPostTemplateProps extends PageRendererProps {
  data: IGqlResponse;
  // eslint-disable-next-line react/no-unused-prop-types
  children: ReactElement[];
}

export function Head(
  { data, location }: IBlogPostTemplateProps,
): ReactElement {
  const { post } = data;

  const {
    title,
    coverImage,
    description,
  } = post.frontmatter;

  return (
    <HtmlHead
      title = { title }
      description = { description || post.excerpt }
      pathname = { location.pathname }
      image = { coverImage?.childImageSharp }
      withCanonical = { true }
    />
  );
}

function Post(props: IBlogPostTemplateProps): ReactElement {
  const {
    data,
    children,
  } = props;

  const theme = useTheme();
  // @ts-ignore
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('blogPostMd'));

  const { state } = props.location;

  const { post } = data;

  const {
    title,
    tags,
    date: posted,
    updated,
    description,
    event,
  } = post.frontmatter;

  // eslint-disable-next-line no-extra-parens
  const activeTag = (state as Record<string, string>)?.activeTag || tags[0];

  const SideMenu = (
    <PostSideMenu
      layout = { isLargeScreen ? 'vertical' : 'horizontal' }
      className = {
        cnBlogPost('SideMenu', {
          vertical: isLargeScreen,
          horizontal: !isLargeScreen,
        })
      }
      postPath = { post.fields.slug }
      postHeader = { title }
      postMetaDescription = { description || post.excerpt }
    />
  );

  return (
    <Layout
      className = { cnBlogPost() }
      testId = { cnBlogPost() }
    >
      <Lightbox/>


      <div className = { cnBlogPost('SideColumn') }></div>

      <div className = { cnBlogPost('CenterColumn') }>
        <article>
          <h1
            data-testid = { cnBlogPost('Title') }
          >
            { title }
          </h1>

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
              activeTag = { activeTag }
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

        {
          !isLargeScreen ?
            <div className = { cnBlogPost('BottomMenu') } >
              { SideMenu }
            </div> : null
        }

        <hr className = { cnBlogPost('BottomLine') }/>

        <BlogPostPaginator
          post = { post }
          tag = { activeTag }
        />
      </div>

      <div className = { cnBlogPost('SideColumn') }>
        { isLargeScreen ? SideMenu : null }
      </div>

    </Layout>
  );
}

// eslint-disable-next-line import/no-default-export
export default Post;
