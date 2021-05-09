/** @jsx jsx */

import React, { ReactElement } from 'react';
import { Link, graphql, PageRendererProps } from 'gatsby';
import { cn } from '@bem-react/classname';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import { Styled, jsx } from 'theme-ui';

import { Layout } from '../../components/Layout';
import { SEO } from '../../components/seo';
import { postsContext } from '../../react-contexts/posts.context';
import { IBlogPost } from '../../types/common.types';
import { PostTags } from './PostTags/PostTags';

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
        tags
        title
      }
    }
  }
`;

enum adjacentPostType {
  prev = 'prev',
  next = 'next',
}

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
    } = post.frontmatter;

    return (
      <Layout
        className = { cnBlogPost() }
      >
        <SEO
          title = { title }
          description = { post.excerpt }
        />

        <Styled.h1>{ title }</Styled.h1>

        <Styled.p sx = {{
          color: 'textMuted',
        }}
        >
          { post.frontmatter.date }
        </Styled.p>

        <Styled.p>
          <PostTags
            tags = { tags }
            activeTag = { this.activeTag }
          />
        </Styled.p>

        <MDXRenderer>{ post.body! }</MDXRenderer>

        <Styled.hr
          className = { cnBlogPost('BottomLine') }
        />

        { this.paginator }
      </Layout>
    );
  }

  /**
   * Returns adjacent posts (if available) based on current post slug and active
   * tag.
   */
  private get adjacentPosts(): [
      IBlogPost | null,
      IBlogPost | null,
  ] {
    const {
      postsPerTag: postsPerTagMap,
    } = this.context;

    const { activeTag } = this;
    const { slug: currentPostSlug } = this.props.data.post.fields;

    const postsPerTag: IBlogPost[] = postsPerTagMap.get(activeTag) as IBlogPost[];

    const currentPostIndex = postsPerTag
      .findIndex(post => post.fields.slug === currentPostSlug);

    const previousPost = currentPostIndex > 0 ?
      postsPerTag[currentPostIndex - 1] : null;

    const nextPostIndex = currentPostIndex + 1;

    const nextPost = nextPostIndex < postsPerTag.length ?
      postsPerTag[nextPostIndex] : null;

    return [
      previousPost,
      nextPost,
    ];
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

  /**
   * Return link for the post page paginator.
   */
  private getAdjacentPostLink(
    post: IBlogPost | null,
    type: adjacentPostType,
  ): ReactElement | null {
    if (!post) {
      return null;
    }

    const postLinkPayload = {
      activeTag: this.activeTag,
    };

    const arrows = {
      [adjacentPostType.next]: '\u2192',
      [adjacentPostType.prev]: '\u2190',
    };

    const labels = [
      arrows[type],
      post.frontmatter.title,
    ];

    if (type === adjacentPostType.next) {
      labels.reverse();
    }

    return (
      <Styled.a
        as = { Link }
        to = { post.fields.slug }
        state = { postLinkPayload }
        rel = { type }
      >
        { labels.join(' ') }
      </Styled.a>
    );
  }

  /**
   * Return two adjacent blog posts links list.
   */
  private get paginator(): ReactElement {
    const [
      previousPost,
      nextPost,
    ] = this.adjacentPosts;

    return (
      <Styled.ul
        className = { cnBlogPost('PaginatorList') }
      >
        <li>{
          this.getAdjacentPostLink(previousPost, adjacentPostType.prev)
        }</li>
        <li>{
          this.getAdjacentPostLink(nextPost, adjacentPostType.next)
        }</li>
      </Styled.ul>
    );
  }
}

BlogPostTemplate.contextType = postsContext;

// eslint-disable-next-line import/no-default-export
export default BlogPostTemplate;
