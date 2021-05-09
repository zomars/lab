import React, { ReactElement } from 'react';
import { StaticQuery, graphql } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';
import { cn } from '@bem-react/classname';
import { classnames } from '@bem-react/classnames';
import { Styled } from 'theme-ui';

import './Bio.scss';

const cnBio = cn('Bio');

export class Bio extends React.Component<{
  className?: string,
}> {
  public render(): ReactElement {
    return (
      <StaticQuery
        query = { bioQuery }
        render = { this.render_ }
      />
    );
  }

  protected render_ = (data: any): ReactElement => {
    return (
      <div className = { classnames(cnBio(), this.props.className) }>
        <GatsbyImage
          className = { cnBio('Avatar') }
          image = { data.avatar.childImageSharp.gatsbyImageData }
          alt = 'Alex Malitsky photo'
          imgStyle = {{
            borderRadius: '50%',
          }}
        />
        <div
          className = { cnBio('Text') }
        >
          <Styled.p>
            Hi, I&apos;m <strong>Alex Malitsky</strong> &mdash;
            frontend architect and engineer based in SF bay area. Born and raised in
            Moscow, Russia.
          </Styled.p>

          <Styled.p>
            Until recently I worked for VMware as UI team lead and prior to that on UI for
            the <a href = "https://www.vmware.com/topics/glossary/content/software-load-balancing">
              software load-balancer
            </a> since early days
            of <a href = "https://avinetworks.com/">AviNetworks</a>.
          </Styled.p>

          <Styled.p>
            <strong>I specialize in:</strong>
            <ul>
              <li>UX</li>
              <li>UI app architecture</li>
              <li>UI infrastructure (bundlers, linters, dev servers, testing)</li>
              <li>JavaScript, TypeScript and OOP</li>
              <li>AngularJs & Angular</li>
              <li>D3 (charts)</li>
            </ul>
          </Styled.p>

          <Styled.p>
            Currently working on web projects of my own (including this website) and
            contributing to open source.
          </Styled.p>

          <Styled.p>
            I&apos;m also a big fan of cars (esp car design and racing) and nuclear energy.
            Expect posts, projects or examples related to those topics.
          </Styled.p>

          <Styled.p>
            You can find me on&nbsp;
            <Styled.a href = 'https://twitter.com/amalitsky'>twitter</Styled.a>,&nbsp;
            <Styled.a href = 'https://github.com/amalitsky/'>github</Styled.a>,&nbsp;
            <Styled.a href = 'https://www.linkedin.com/in/amalitsky'>linkedin</Styled.a>
            &nbsp;or reach out via <strong>alex at amalitsky dot com</strong>.
          </Styled.p>
        </div>
      </div>
    );
  };
}

const bioQuery = graphql`
  query BioQuery {
    avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
      childImageSharp {
        gatsbyImageData(width: 50)
      }
    }
  }
`;
