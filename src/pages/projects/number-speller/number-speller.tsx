import React, { ReactElement } from 'react';
import { cn } from '@bem-react/classname';
import { Tooltip } from '@mui/material';

import { Layout } from '../../../components/Layout';
import { NumberSpeller } from '../../../components/NumberSpeller/NumberSpeller';
import { Seo } from '../../../components/Seo/Seo';
import { OutboundLink } from '../../../components/OutboundLink/OutboundLink';

import './number-speller.scss';

const cnNumberSpellerPage = cn('NumberSpellerPage');

const keywords = [
  'number-speller',
  'project',
  'online number speller',
  'numbers',
  'spelling',
  'service',
];

function NumberSpellerPage(): ReactElement {
  return (
    <Layout
      data-testid = { cnNumberSpellerPage() }
    >
      <Seo
        title = 'Spell numbers into English words online'
        description = 'Online numbers speller'
        keywords = { keywords }
      />

      <h2>Spell a Number</h2>

      <p>
        Spells
        out <Tooltip title = "See details below">
          <i>any</i>
        </Tooltip> number in plain English.
        Particularly useful for legal documents.
      </p>

      <NumberSpeller/>

      <h3 className = { cnNumberSpellerPage('DetailsHeader') }>Details</h3>

      <ul>
        <li>
          Positive numbers under thousand billion (999 999 999 999 to be precise)
          are supported
        </li>
        <li>Numbers with fractional part get rounded to the closest integer</li>
        <li>Spaces are ok</li>
        <li>
          Conversion algorithm is
          hosted on { ' ' }
          <OutboundLink href = 'https://github.com/amalitsky/number-speller'>Github</OutboundLink>
          { ' ' } and
          is available
          as { ' ' }
          <OutboundLink href = 'https://www.npmjs.com/package/number-speller'>number-speller</OutboundLink>
          { ' ' } NPM package
        </li>
        <li>
          Please let me know if you would prefer hyphens for numbers
          between <i>twenty-one</i> and <i>ninety-nine</i>
        </li>
      </ul>
    </Layout>
  );
}

// eslint-disable-next-line import/no-default-export
export default NumberSpellerPage;
