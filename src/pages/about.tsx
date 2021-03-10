import { Styled } from 'theme-ui';

import React, { ReactElement } from 'react';
import { Layout } from '../components/Layout';
import Bio from '../components/Bio/Bio';

class AboutPage extends React.Component {
  public render(): ReactElement {
    return (
      <Layout
        location={(this.props as any).location}
      >
        <Styled.h1>About this blog and the author</Styled.h1>
        <Bio/>
      </Layout>
    )
  }
}

export default AboutPage
