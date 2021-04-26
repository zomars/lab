/**
 * @fileoverview
 *
 * Required to have index.html file created. Sic!
 * Actual content doesn't really matter.
 */

import React, { ReactElement } from 'react';

import { Layout } from '../components/Layout';

class FakePage extends React.Component {
  // eslint-disable-next-line class-methods-use-this
  public render(): ReactElement {
    return <Layout/>;
  }
}

// eslint-disable-next-line import/no-default-export
export default FakePage;
