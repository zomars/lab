import React, { ReactElement } from 'react'
import { graphql } from 'gatsby';
import { BlogIndex } from '../components/BlogIndex/BlogIndex';

class IndexPage extends React.Component {
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

export default IndexPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMdx(sort: { fields: [frontmatter___date], order: DESC }) {
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
