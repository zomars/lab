import React, { ReactElement } from 'react';
import { Link, graphql, PageRendererProps } from 'gatsby';
import { cn } from '@bem-react/classname';
import { MDXRenderer } from 'gatsby-plugin-mdx';

import { Layout } from '../../components/Layout';
import { SEO } from '../../components/seo';
import { postsContext } from '../../react-contexts/posts.context';
import { IBlogPost } from '../../types/common.types';
import { PostTags } from '../../components/PostTags/PostTags';

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

        <h1>{ title }</h1>

        <p className = { cnBlogPost('Date') }>
          { post.frontmatter.date }
        </p>

        <p>
          <PostTags
            tags = { tags }
            activeTag = { this.activeTag }
          />
        </p>

        <MDXRenderer>{ post.body! }</MDXRenderer>

        <hr className = { cnBlogPost('BottomLine') }/>

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
      <Link
        to = { post.fields.slug }
        state = { postLinkPayload }
        rel = { type }
      >
        { labels.join(' ') }
      </Link>
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

    const prevLink = this.getAdjacentPostLink(previousPost, adjacentPostType.prev);
    const nextLink = this.getAdjacentPostLink(nextPost, adjacentPostType.next);

    return (
      <ul
        className = { cnBlogPost('PaginatorList') }
      >
        { prevLink ?
          <li className = { cnBlogPost('PaginatorListElement') }>
            { prevLink }
          </li> : null }

        { nextLink ?
          <li className = { cnBlogPost('PaginatorListElement', { next: true }) }>
            { nextLink }
          </li> : null }
      </ul>
    );
  }
}

BlogPostTemplate.contextType = postsContext;

// eslint-disable-next-line import/no-default-export
export default BlogPostTemplate;
