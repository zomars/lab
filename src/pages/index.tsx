import { Styled } from 'theme-ui';
import React, { ReactElement } from 'react';

import { Layout } from '../components/Layout';
import { Bio } from '../components/Bio/Bio';

class AboutPage extends React.Component {
  // eslint-disable-next-line class-methods-use-this
  public render(): ReactElement {
    return (
      <Layout>
        <Styled.h1>About this blog and the author</Styled.h1>
        <Bio/>
      </Layout>
    );
  }
}

// eslint-disable-next-line import/no-default-export
export default AboutPage;
