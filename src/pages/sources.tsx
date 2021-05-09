import React, { ReactElement } from 'react';
import { Styled } from 'theme-ui';

import { Layout } from '../components/Layout';

function Sources(): ReactElement {
  return (
    <Layout>
      <Styled.h1>Sources</Styled.h1>

      <Styled.p>
        List of incredibly useful and insightful resources related to frontend development
        and beyond. Most of these I&apos;ve read or listened to more than once.
      </Styled.p>

      <Styled.h2>Blogs to follow</Styled.h2>
      <ul>
        <li>
          <Styled.a href = 'https://blog.mgechev.com'>Minko Gechev</Styled.a>
          &nbsp;&mdash; Angular and Typescript. Member of Angular team
        </li>
        <li>
          <Styled.a href = 'https://coryrylan.com/'>Cory Rylan</Styled.a>
          &nbsp;&mdash; modern Web Components. Member of VMware Clarity team
        </li>
        <li>
          <Styled.a href = 'https://www.yegor256.com'>Yegor Bugayenko</Styled.a>
          &nbsp;&mdash; software architecture and dev team management.
          Quite controversial fellow
        </li>
        <li>
          <Styled.a href = 'https://www.mynameisjehad.com/author/jehad/'>
            Jehad Affoneh
          </Styled.a>
          &nbsp;&mdash; design for enterprise on management level
        </li>
        <li>
          <Styled.a href = 'https://svpg.com/articles/'>Marty Cagan</Styled.a>
          &nbsp;&mdash; product management
        </li>
      </ul>

      <Styled.h2>Outstanding articles and conversations</Styled.h2>

      <Styled.p>Truly extraordinary stuff! Can&apos;t recommend these enough:</Styled.p>

      <ul>
        <li>
          <Styled.a
            href = 'http://dmitrysoshnikov.com/ecmascript/javascript-the-core-2nd-edition/'
          >
            JavaScript. The Core
          </Styled.a>
          &nbsp;by <Styled.a href = 'https://twitter.com/DmitrySoshnikov'>
            Dmitry Soshnikov
          </Styled.a> &mdash; fundamentals of JS OOP in depth
        </li>
        <li>
          <Styled.a href = 'https://hbr.org/2020/11/how-apple-is-organized-for-innovation'>
            Leadership/management approach at Apple
          </Styled.a>
          &nbsp;by Joel M. Podolny and Morten T. Hansen
        </li>
        <li>
          <Styled.a href = 'https://soundcloud.com/invisionapp/silicon-valley-product-groups'>
            Why product management is misunderstood
          </Styled.a> with <Styled.a href = 'https://twitter.com/cagan'>Marty Cagan</Styled.a>
        </li>
      </ul>

      <Styled.h2>Books</Styled.h2>

      <ul>
        <li>
          <Styled.a href = 'https://en.wikipedia.org/wiki/The_Pragmatic_Programmer'>
            The Pragmatic Programmer
          </Styled.a>
          &nbsp;by Andrew Hunt and David Thomas
          &mdash; &quot;Philosophy&quot; of software development
        </li>
        <li>
          <Styled.a href = 'https://en.wikipedia.org/wiki/The_Mythical_Man-Month'>
            The Mythical Man-Month
          </Styled.a>
          &nbsp;by Fred Brooks
          &mdash;Management/leading perspective on software development
        </li>
      </ul>

      <Styled.p>
        <i>TBD: Add sources in russian</i>
      </Styled.p>
    </Layout>
  );
}

// eslint-disable-next-line import/no-default-export
export default Sources;
