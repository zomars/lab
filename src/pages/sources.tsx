import { PageRendererProps } from 'gatsby';
import React, { ReactElement } from 'react';

import { Layout } from '../components/Layout';
import { Seo } from '../components/Seo/Seo';
import { OutboundLink } from '../components/OutboundLink/OutboundLink';

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
        withCanonical = { true }
      />
      <h1>Sources</h1>
      <p>
        List of incredibly useful and insightful resources related to frontend development
        and beyond.
        <br/>
        { ' ' } Most of these I&apos;ve read and listened to more than once.
        <br/>
        { ' ' } Hope you will find them useful too!
      </p>

      <h2>Blogs and Personal Websites</h2>
      <ul>
        <li>
          <OutboundLink href = 'https://blog.mgechev.com'>Minko Gechev</OutboundLink>
          { ' ' } &mdash; Angular and Typescript. Member of Angular team
        </li>
        <li>
          <OutboundLink href = 'https://coryrylan.com/'>Cory Rylan</OutboundLink>
          { ' ' } &mdash; modern Web Components. Ex-member of VMware Clarity team
        </li>
        <li>
          <OutboundLink href = 'https://www.yegor256.com'>Yegor Bugayenko</OutboundLink>
          { ' ' } &mdash; software architecture and dev team management.
          Quite controversial fellow
        </li>
        <li>
          <OutboundLink href = 'https://www.jasonformat.com'>Jason Miller</OutboundLink>
          { ' ' } &mdash; author of Preact JS and other UI goodies
        </li>
        <li>
          <OutboundLink href = 'https://www.mynameisjehad.com/author/jehad/'>
            Jehad Affoneh
          </OutboundLink>
          { ' ' } &mdash; design management for enterprise businesses
        </li>
        <li>
          <OutboundLink href = 'https://svpg.com/articles/'>Marty Cagan</OutboundLink>
          { ' ' } &mdash; product management
        </li>
        <li>
          <OutboundLink href = 'https://codsen.com/os'>Roy Revelt (Codsen)</OutboundLink>
          { ' ' } &mdash; <i>serial</i> opensource contributor with over <b>150</b>
          { ' ' } NPM packages under his belt.
          { ' ' } I&apos;m using the amazing
          { ' ' } <OutboundLink href = 'https://codsen.com/os/remark-typography/'>
            remark-typography
          </OutboundLink>
          { ' ' } on this website to fix up the typography of pages generated from markdown files.
        </li>
      </ul>

      <h2>Outstanding Articles</h2>

      <p>Extraordinary stuff! Can&apos;t recommend these enough:</p>

      <ul>
        <li>
          <OutboundLink
            href = 'http://dmitrysoshnikov.com/ecmascript/javascript-the-core-2nd-edition/'
          >
            JavaScript. The Core
          </OutboundLink>
          { ' ' } by { ' ' }
          <OutboundLink href = 'https://twitter.com/DmitrySoshnikov'>
            Dmitry Soshnikov
          </OutboundLink>
          { ' ' } &mdash; fundamentals of JS OOP in depth
        </li>
        <li>
          <OutboundLink href = 'https://hbr.org/2020/11/how-apple-is-organized-for-innovation'>
            Leadership/management approach at Apple
          </OutboundLink>
          { ' ' } by Joel M. Podolny and Morten T. Hansen
        </li>
      </ul>

      <h2>Insightful Conversations</h2>

      <ul>
        <li>
          <OutboundLink href = 'https://soundcloud.com/invisionapp/silicon-valley-product-groups'>
            Why product management is misunderstood
          </OutboundLink>
          { ' ' } with { ' ' }
          <OutboundLink href = 'https://twitter.com/cagan'>Marty Cagan</OutboundLink>
        </li>
        <li>
          <OutboundLink
            href = 'https://podcasts.apple.com/us/podcast/build-with-maggie-crowley/id1445050691'
          >
            How to Negotiate a Job Offer
          </OutboundLink>
          { ' ' } with { ' ' }
          <OutboundLink href = 'https://twitter.com/thelindazhang'>Linda Zhang</OutboundLink>
        </li>
        <li>
          <OutboundLink href = 'https://podcasts.apple.com/us/podcast/design-better-podcast/id1266839739'>
            Navigating career changes
          </OutboundLink>
          { ' ' } with { ' ' }
          <OutboundLink href = 'https://twitter.com/wertandcompany'>Judy Wert</OutboundLink>
        </li>
        <li>
          <OutboundLink href = 'https://podcasts.apple.com/us/podcast/reconsidering/id1583614282'>
            Coaching yourself into a better career
          </OutboundLink>
          { ' ' } with { ' ' }
          <OutboundLink href = "https://twitter.com/edbatista">Ed Batista</OutboundLink>.
          <br/>
          { ' ' } They talk about concept of coaching, how it is different from mentoring
          and what impact it might have on you life.
        </li>
      </ul>

      <h2>Best Books I&apos;ve Ever Come Across</h2>

      <ul>
        <li>
          <OutboundLink href = 'https://en.wikipedia.org/wiki/The_Pragmatic_Programmer'>
            The Pragmatic Programmer
          </OutboundLink>
          { ' ' } by Andrew Hunt and David Thomas
          &mdash; &quot;Philosophy&quot; of software development
        </li>
        <li>
          <OutboundLink href = 'https://en.wikipedia.org/wiki/The_Mythical_Man-Month'>
            The Mythical Man-Month
          </OutboundLink>
          { ' ' } by Fred Brooks &mdash; Management/lead perspective on software development
        </li>
        <li>
          <OutboundLink
            href = 'https://www.juliezhuo.com/book/manager.html'
          >
            The Making of a Manager
          </OutboundLink>
          { ' ' } by { ' ' }
          <OutboundLink href = 'https://twitter.com/joulee'>Julie Zhuo</OutboundLink>
          { ' ' } &mdash; Management 101 course
        </li>
      </ul>

      <h2>Courses and Tutorials</h2>

      <ul>
        <li>
          <OutboundLink href = 'https://javascript.info/'>The Modern JS Tutorial</OutboundLink>
        </li>
      </ul>

      <h2>Twitter lists</h2>

      My compilation of prominent { ' ' }
      <OutboundLink
        href = 'https://twitter.com/i/lists/1163692012383588352'
      >
        frontend folks and developers in general
      </OutboundLink>.
      Follow this list for unexpected enlightenment in various areas of tech.
      Similar but much shorter (<i>oops&hellip;</i>) list of { ' ' }
      <OutboundLink
        href = 'https://twitter.com/i/lists/1260610528000356352'
      >
        designers on twitter
      </OutboundLink>. Follow this one for an inspiration.
    </Layout>
  );
}

// eslint-disable-next-line import/no-default-export
export default Sources;
