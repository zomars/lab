import React, { ReactElement } from 'react';

import { Layout } from '../components/Layout';
import { HtmlHead } from '../components/HtmlHead/HtmlHead';

export function Head(): ReactElement {
  return (
    <HtmlHead
      title = 'Not Found 404'
    />
  );
}

function NotFoundPage(): ReactElement {
  return (
    <Layout>
      <h1>Not Found</h1>
      <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
    </Layout>
  );
}

// eslint-disable-next-line import/no-default-export
export default NotFoundPage;
