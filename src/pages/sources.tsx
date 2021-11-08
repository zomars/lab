import { PageRendererProps } from 'gatsby';
import React, { ReactElement } from 'react';

import { Layout } from '../components/Layout';
import { Seo } from '../components/Seo';

const pageKeywords = [
  'frontend',
  'books',
  'people',
  'podcasts',
  'twitter',
  'courses',
  'UI',
  'experts',
  'UX',
  'engineering',
  'javascript',
  'typescript',
];

export function Sources(props: PageRendererProps): ReactElement {
  const description =
    'List of incredibly useful and insightful resources related to frontend development ' +
    'and beyond. Most of these I\'ve read or listened to more than once.';

  return (
    <Layout>
      <Seo
        title = 'Frontend sources, references, conversations, books and courses'
        keywords = { pageKeywords }
        pathname = { props.location.pathname }
        description = { description }
      />
      <h1>Sources</h1>
      <p>
        { description }
      </p>

      <h2>Blogs</h2>
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
          <a href = 'https://www.jasonformat.com'>Jason Miller</a>
          {' '}&mdash; author of Preact. JS and UI goodies
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

      <h2>Outstanding Articles</h2>

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
      </ul>

      <h2>Outstanding Conversations</h2>

      <ul>
        <li>
          <a href = 'https://soundcloud.com/invisionapp/silicon-valley-product-groups'>
            Why product management is misunderstood
          </a> with <a href = 'https://twitter.com/cagan'>Marty Cagan</a>
        </li>
        <li>
          <a href = 'https://podcasts.apple.com/us/podcast/build-with-maggie-crowley/id1445050691'>
            How to Negotiate a Job Offer
          </a> with <a href = 'https://twitter.com/thelindazhang'>Linda Zhang</a>
        </li>
        <li>
          <a href = 'https://podcasts.apple.com/us/podcast/design-better-podcast/id1266839739'>
            Navigating career changes
          </a> with <a href = 'https://twitter.com/wertandcompany'>Judy Wert</a>
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
          &mdash; Management/lead perspective on software development
        </li>
        <li>
          <a href = 'https://www.juliezhuo.com/book/manager.html'>The Making of a Manager</a>
          {' '}by <a href = 'https://twitter.com/joulee'>Julie Zhuo</a>
          {' '}&mdash; Management 101 course
        </li>
      </ul>

      <h2>Twitter lists</h2>
      <ul>
        <li>My compilation of prominent <a href = 'https://twitter.com/i/lists/1163692012383588352'>frontend folks</a> and devs in general</li>
      </ul>
    </Layout>
  );
}

// eslint-disable-next-line import/no-default-export
export default Sources;
