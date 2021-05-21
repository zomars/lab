import React, { ReactElement } from 'react';

import { Layout } from '../components/Layout';

function Sources(): ReactElement {
  return (
    <Layout>
      <h1>Sources</h1>

      <p>
        List of incredibly useful and insightful resources related to frontend development
        and beyond. Most of these I&apos;ve read or listened to more than once.
      </p>

      <h2>Blogs to follow</h2>
      <ul>
        <li>
          <a href = 'https://blog.mgechev.com'>Minko Gechev</a>
          {' '}&mdash; Angular and Typescript. Member of Angular team
        </li>
        <li>
          <a href = 'https://coryrylan.com/'>Cory Rylan</a>
          {' '}&mdash; modern Web Components. Member of VMware Clarity team
        </li>
        <li>
          <a href = 'https://www.yegor256.com'>Yegor Bugayenko</a>
          {' '}&mdash; software architecture and dev team management.
          Quite controversial fellow
        </li>
        <li>
          <a href = 'https://www.mynameisjehad.com/author/jehad/'>
            Jehad Affoneh
          </a>
          {' '}&mdash; design for enterprise on management level
        </li>
        <li>
          <a href = 'https://svpg.com/articles/'>Marty Cagan</a>
          {' '}&mdash; product management
        </li>
      </ul>

      <h2>Outstanding articles and conversations</h2>

      <p>Truly extraordinary stuff! Can&apos;t recommend these enough:</p>

      <ul>
        <li>
          <a
            href = 'http://dmitrysoshnikov.com/ecmascript/javascript-the-core-2nd-edition/'
          >
            JavaScript. The Core
          </a>
          {' '}by <a href = 'https://twitter.com/DmitrySoshnikov'>
            Dmitry Soshnikov
          </a> &mdash; fundamentals of JS OOP in depth
        </li>
        <li>
          <a href = 'https://hbr.org/2020/11/how-apple-is-organized-for-innovation'>
            Leadership/management approach at Apple
          </a>
          {' '}by Joel M. Podolny and Morten T. Hansen
        </li>
        <li>
          <a href = 'https://soundcloud.com/invisionapp/silicon-valley-product-groups'>
            Why product management is misunderstood
          </a> with <a href = 'https://twitter.com/cagan'>Marty Cagan</a>
        </li>
      </ul>

      <h2>Books</h2>

      <ul>
        <li>
          <a href = 'https://en.wikipedia.org/wiki/The_Pragmatic_Programmer'>
            The Pragmatic Programmer
          </a>
          {' '}by Andrew Hunt and David Thomas
          &mdash; &quot;Philosophy&quot; of software development
        </li>
        <li>
          <a href = 'https://en.wikipedia.org/wiki/The_Mythical_Man-Month'>
            The Mythical Man-Month
          </a>
          {' '}by Fred Brooks
          &mdash;Management/leading perspective on software development
        </li>
      </ul>

      <p>
        <i>TBD: Add sources in russian</i>
      </p>
    </Layout>
  );
}

// eslint-disable-next-line import/no-default-export
export default Sources;