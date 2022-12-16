import React, { ReactElement } from 'react';
import { PageRendererProps, Link } from 'gatsby';
import { HtmlHead } from '../components/HtmlHead/HtmlHead';

import { Layout } from '../components/Layout';
import { Bio } from '../components/Bio/Bio';
import { OutboundLink } from '../components/OutboundLink/OutboundLink';

export function Head(props: PageRendererProps): ReactElement {
  return (
    <HtmlHead
      title = 'About Alex Malitsky'
      description = 'Alex Malitsky bio'
      pathname = { props.location.pathname }
      withCanonical = { true }
    />
  );
}

export function About(): ReactElement {
  return (
    <Layout>
      <h1>About me</h1>

      <Bio/>

      <h2>Opensource Projects</h2>

      <p>
        <Link to = '/projects/number-speller/'>Spell a Number</Link>
        { ' ' } - spells number in
        plain English. Useful for legal documents.
        { ' ' }
        <OutboundLink
          href = 'https://www.npmjs.com/package/number-speller'
        >
          Number-speller NPM module
        </OutboundLink>.
      </p>

      <h2>Opensource Contributions</h2>

      <p>
        <OutboundLink
          href = 'https://github.com/statoscope/statoscope'
        >
          Statoscope
        </OutboundLink>
        { ' ' } - amazing tool for analyzing application bundle with extensive linting abilities.
        { ' ' }
        <OutboundLink
          href = 'https://github.com/statoscope/statoscope/pulls?q=is%3Apr+author%3Aamalitsky'
        >
          My contributions
        </OutboundLink>.
      </p>
    </Layout>
  );
}

// eslint-disable-next-line import/no-default-export
export default About;
