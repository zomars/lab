import React, { ReactElement } from 'react';
import { Link, graphql } from 'gatsby';
import { Layout } from '../../components/Layout';
import { SEO } from '../../components/seo';
import { cn } from '@bem-react/classname';

import './BlogPost.scss';

const cnBlogPost = cn('BlogPost');

class BlogPostTemplate extends React.Component {
  public render(): ReactElement {
    const {
      data,
      pageContext,
      location,
    } = this.props as any;

    const {
      markdownRemark: post,
      site
    } = data;

    const { title: siteTitle } = site.siteMetadata;
    const { previous, next } = pageContext as any;

    return (
      <Layout
        location = { location }
        title = { siteTitle }
        className = { cnBlogPost() }
      >
        <SEO
          title = { post.frontmatter.title }
          description = { post.excerpt }/>
        <h1>{ post.frontmatter.title }</h1>
        <p
          style={ {
            display: `block`,
          } }
        >
          { post.frontmatter.date }
        </p>
        <div dangerouslySetInnerHTML = { { __html: post.html } }/>
        <hr/>
        <ul
          style={ {
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          } }
        >
          <li>
            { previous && (
              <Link to = { previous.fields.slug } rel = 'prev'>
                ← { previous.frontmatter.title }
              </Link>
            ) }
          </li>
          <li>
            { next && (
              <Link to = { next.fields.slug } rel = 'next'>
                { next.frontmatter.title } →
              </Link>
            ) }
          </li>
        </ul>
      </Layout>
    );
  }
}

export default BlogPostTemplate;

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
      }
    }
  }
`;
