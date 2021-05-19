import React, { ReactElement } from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import { cn } from '@bem-react/classname';
import { classnames } from '@bem-react/classnames';

import './Bio.scss';

const cnBio = cn('Bio');

export class Bio extends React.Component<{
  className?: string,
}> {
  public render(): ReactElement {
    return (
      <div className = { classnames(cnBio(), this.props.className) }>
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
            Hi, I&apos;m <strong>Alex Malitsky</strong> &mdash;
            frontend architect and engineer based in SF bay area. Originally from
            Moscow, Russia.
          </p>

          <p>
            Until recently I worked for VMware as UI team lead and prior to that as a senior
            engineer on the UI for the{' '}
            <a href = "https://www.vmware.com/topics/glossary/content/software-load-balancing">
              software load-balancer
            </a> since the early days
            of <a href = "https://avinetworks.com/">AviNetworks</a>.
          </p>

          <p>
            I specialize in:
            <ul>
              <li>UX</li>
              <li>UI app architecture</li>
              <li>UI infrastructure (bundlers, linters, dev servers, testing)</li>
              <li>JavaScript, TypeScript and OOP</li>
              <li>AngularJs & Angular</li>
              <li>D3 (charts)</li>
            </ul>
          </p>

          <p>
            Currently working on web projects of my own (including this blog) and
            contributing to open source.
          </p>

          <p>
            I&apos;m a big fan of cars (esp car design and racing) and nuclear energy.
            You can expect posts, projects or simply examples related to those.
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
}
