import React, { ReactElement } from 'react';
import { graphql, PageRendererProps } from 'gatsby';
import { Layout } from '../components/Layout';
import { SEO } from '../components/seo';

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`;

class NotFoundPage extends React.Component<PageRendererProps> {
  // eslint-disable-next-line class-methods-use-this
  public render(): ReactElement {
    return (
      <Layout>
        <SEO title = '404: Not Found'/>
        <h1>Not Found</h1>
        <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
      </Layout>
    );
  }
}

// eslint-disable-next-line import/no-default-export
export default NotFoundPage;
