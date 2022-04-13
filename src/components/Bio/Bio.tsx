import React, { ReactElement } from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import { cn } from '@bem-react/classname';
import { classnames } from '@bem-react/classnames';

import './Bio.scss';

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
          frontend architect and engineer based in SF bay area.
        </p>

        <p>
          Until recently I worked for VMware as UI team lead and prior to that as a senior UI
          engineer for the{' '}
          <a href = "https://www.vmware.com/topics/glossary/content/software-load-balancing">
            software load-balancer
          </a> UI since the early days
          of <a href = "https://avinetworks.com/">AviNetworks</a>.
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
          contributing to open source.
        </p>

        <p>
          I&apos;m a big fan of cars (esp car design and racing) and nuclear energy.
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
          {' '}<a href = 'https://twitter.com/amalitsky'>twitter</a>,
          {' '}<a href = 'https://github.com/amalitsky/'>github</a>,
          {' '}<a href = 'https://www.linkedin.com/in/amalitsky'>linkedin</a>
          {' '}or via <strong>alex at amalitsky dot com</strong>.
        </p>
      </div>
    </div>
  );
}
