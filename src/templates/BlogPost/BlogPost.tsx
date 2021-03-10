import React, { ReactElement } from 'react';
import { Link, graphql } from 'gatsby';
import { Layout } from '../../components/Layout';
import { SEO } from '../../components/seo';
import { cn } from '@bem-react/classname';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import { Styled } from 'theme-ui';

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
      mdx: post,
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
        <Styled.h1>{ post.frontmatter.title }</Styled.h1>
        <Styled.p>
          { post.frontmatter.date }
        </Styled.p>
        <MDXRenderer>{ post.body }</MDXRenderer>
        <Styled.hr/>
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
              <Styled.a as = {Link} to = { previous.fields.slug } rel = 'prev'>
                ← { previous.frontmatter.title }
              </Styled.a>
            ) }
          </li>
          <li>
            { next && (
              <Styled.a as = {Link} to = { next.fields.slug } rel = 'next'>
                { next.frontmatter.title } →
              </Styled.a>
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
    mdx(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      body
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
      }
    }
  }
`;
