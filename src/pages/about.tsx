import React, { ReactElement } from 'react';

import { Layout } from '../components/Layout';
import { Bio } from '../components/Bio/Bio';
import { Seo } from '../components/Seo';

export function About(): ReactElement {
  return (
    <Layout>
      <Seo
        title = 'About the Author'
        description = 'Alex Malitsky bio'
      />
      <h1>About me</h1>
      <Bio/>
    </Layout>
  );
}

// eslint-disable-next-line import/no-default-export
export default About;
