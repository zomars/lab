import BlogIndex from './blog'
import React, { ReactElement } from 'react'
import {graphql} from "gatsby";

class IndexPage extends React.Component {
  public render (): ReactElement {
    const { data, location } = this.props as any

    return (
      <BlogIndex
        location={location}
        data={data}
      />
    )
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
`
