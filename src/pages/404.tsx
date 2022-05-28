import React, { ReactElement } from 'react';
import { graphql } from 'gatsby';
import { Layout } from '../components/Layout';
import { Seo } from '../components/Seo/Seo';

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`;

function NotFoundPage(): ReactElement {
  return (
    <Layout>
      <Seo title = '404: Not Found'/>
      <h1>Not Found</h1>
      <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
    </Layout>
  );
}

// eslint-disable-next-line import/no-default-export
export default NotFoundPage;
