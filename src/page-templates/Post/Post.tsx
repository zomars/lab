import React, {
  ReactElement,
  useEffect,
  useState,
} from 'react';

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
import { PostContextProvider } from '../../context-providers/PostContextProvider';
import { usePostDispatch } from '../../hooks/usePost';
import { useLocalStoragePostLike } from '../../hooks/useLocalStoragePostLike.hook';
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
  const sidebarMenuLocation = useMediaQuery(theme.breakpoints.up('blogPostMd'));
  // between small and `blogPostMd` we have `TopMenu` with share and like buttons
  const withTopPostMenu = useMediaQuery(theme.breakpoints.up('sm')) && !sidebarMenuLocation;
  const [firstRender, setFirstRender] = useState(true);

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

  const { slug: postId } = post.fields;

  const dispatchPostContext = usePostDispatch();

  const [getPostLikeFromStorage] = useLocalStoragePostLike(postId);

  if (firstRender) {
    setFirstRender(false);

    const liked = getPostLikeFromStorage();

    dispatchPostContext({
      type: 'set',
      post: {
        path: postId,
        title,
        description,
        liked,
      },
    });
  }

  // cleanup post context on node removal
  useEffect(() => {
    return () => {
      dispatchPostContext({ type: 'unset' });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeTag = (state as Record<string, string>)?.activeTag || tags[0];

  const SideMenu = (
    <PostSideMenu
      layout = { sidebarMenuLocation ? 'vertical' : 'horizontal' }
      className = {
        cnBlogPost('SideMenu', {
          vertical: sidebarMenuLocation,
          horizontal: !sidebarMenuLocation,
        })
      }
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

          <div
            className = { cnBlogPost('MetaWrapper') }
          >
            <div className = { cnBlogPost('Meta') }>
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

              <p className = { cnBlogPost('PostTags') }>
                <PostTags
                  tags = { tags }
                  activeTag = { activeTag }
                />
              </p>
            </div>

            {
              withTopPostMenu ?
                <div className = { cnBlogPost('TopMenu') } >
                  <PostSideMenu
                    layout = 'horizontal'
                    buttons = { ['share', 'like'] }
                  />
                </div> : null
            }
          </div>

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
          !sidebarMenuLocation ?
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
        { sidebarMenuLocation ? SideMenu : null }
      </div>

    </Layout>
  );
}

export default function PostWrapper(props: IBlogPostTemplateProps): ReactElement {
  return (
    <PostContextProvider>
      <Post { ...props }>
        { props.children }
      </Post>
    </PostContextProvider>
  );
}
