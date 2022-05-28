import { PageRendererProps, Link } from 'gatsby';
import React, { ReactElement } from 'react';

import { Layout } from '../components/Layout';
import { Bio } from '../components/Bio/Bio';
import { Seo } from '../components/Seo/Seo';

export function About(props: PageRendererProps): ReactElement {
  return (
    <Layout>
      <Seo
        title = 'About the Author'
        description = 'Alex Malitsky bio'
        pathname = { props.location.pathname }
      />

      <h1>About me</h1>

      <Bio/>

      <h2>Opensource Projects</h2>

      <p>
        <Link to = "/projects/number-speller">Spell a Number</Link> - spells number in
        plain English.
        Useful for legal documents.&nbsp;
        <a href = "https://www.npmjs.com/package/number-speller">Number-speller</a> NPM module.
      </p>

      <h2>Opensource Contributions</h2>

      <p>
        <a href = "https://github.com/statoscope/statoscope">Statoscope</a> -
        amazing tool for analyzing application bundle.
        With extensive linting abilities.&nbsp;
        <a href = "https://github.com/statoscope/statoscope/pulls?q=is%3Apr+author%3Aamalitsky+">My contributions</a>.
      </p>
    </Layout>
  );
}

// eslint-disable-next-line import/no-default-export
export default About;
