import { graphql } from 'gatsby';
import React, { ReactElement } from 'react';
import { BlogIndex } from './BlogIndex/BlogIndex';

class BlogIndexPage extends React.Component {
  public render(): ReactElement {
    const { data, location } = this.props as any;

    return (
      <BlogIndex
        location = { location }
        data = { data }
      />
    );
  }
}

export default BlogIndexPage;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt(pruneLength: 250)
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
          }
        }
      }
    }
  }
`;
