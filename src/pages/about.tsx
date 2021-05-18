import React, { ReactElement } from 'react';

import { Layout } from '../components/Layout';
import { Bio } from '../components/Bio/Bio';

class AboutPage extends React.Component {
  // eslint-disable-next-line class-methods-use-this
  public render(): ReactElement {
    return (
      <Layout>
        <h1>About the author</h1>
        <Bio/>
      </Layout>
    );
  }
}

// eslint-disable-next-line import/no-default-export
export default AboutPage;
