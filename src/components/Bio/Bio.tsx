import React, { ReactElement } from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import { cn } from '@bem-react/classname';
import { classnames } from '@bem-react/classnames';

import './Bio.scss';
import { OutboundLink } from '../OutboundLink/OutboundLink';

const cnBio = cn('Bio');

export function Bio(
  props: { className?: string },
): ReactElement {
  return (
    <div className = { classnames(cnBio(), props.className) }>
      <StaticImage
        className = { cnBio('Avatar') }
        src = '../../../content/assets/profile-pic.jpg'
        imgStyle = {{
          borderRadius: '50%',
        }}
        alt = 'Alex Malitsky photo'
      />
      <div
        className = { cnBio('Text') }
      >
        <p>
          Hi! I&apos;m Alex Malitsky &mdash;
          frontend architect and tech lead based in San Francisco Bay area.
        </p>

        <p>
          Until recently I worked for VMware as UI team lead and prior to that as a senior UI
          engineer for the {' '}
          <OutboundLink
            href = 'https://www.vmware.com/topics/glossary/content/software-load-balancing'
          >
            software load-balancer
          </OutboundLink>
          { ' ' } UI since the early days of { ' ' }
          <OutboundLink
            href = 'https://avinetworks.com/'
          >
            AviNetworks
          </OutboundLink>.
        </p>

        <p>
          I specialize in:
          <ul>
            <li>frontend architecture</li>
            <li>UI infrastructure (bundlers, linters, dev servers, testing)</li>
            <li>JavaScript, TypeScript and OOP</li>
            <li>AngularJs & Angular</li>
            <li>D3 (data visualizations)</li>
            <li>UX</li>
          </ul>
        </p>

        <p>
          Currently I&apos;m working on web projects of my own (including this blog) and
          open source contributions.
        </p>

        <p>
          I&apos;m a big fan of cars (esp car design and sports cars racing) and nuclear energy.
          You can expect posts, projects and examples/illustrations related to those subjects.
        </p>

        <p>
          In this blog I&apos;m writing down ideas and learnings from my development and
          engineering experience. Main reason being the desire to reflect on these and have
          them formulated in more or less succinct form so that I, myself, could come back and
          re-learn something if needed.
        </p>

        <p>
          You can find me on
          {' '}<OutboundLink href = 'https://twitter.com/amalitsky'>twitter</OutboundLink>,
          {' '}<OutboundLink href = 'https://github.com/amalitsky/'>github</OutboundLink>,
          {' '}<OutboundLink href = 'https://www.linkedin.com/in/amalitsky'>linkedin</OutboundLink>
          {' '}or at <strong>alex at amalitsky dot com</strong>.
        </p>
      </div>
    </div>
  );
}
