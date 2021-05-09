import { Styled } from 'theme-ui';
import React, { ReactElement } from 'react';
import { Link } from 'gatsby';
import { cn } from '@bem-react/classname';
import { classnames } from '@bem-react/classnames';
// eslint-disable-next-line import/no-unresolved
import { LinkGetProps } from '@reach/router'; // peer dependency through gatsby

import { IPostContext } from '../../react-contexts/posts.context';

import './Header.scss';

const cnHeader = cn('Header');

const topSections = [
  {
    name: 'Tech Posts',
    path: '/blog/tech',
  }, {
    name: 'Cars Posts',
    path: '/blog/cars',
  }, {
    name: 'Sources',
    path: '/sources',
  }, {
    name: 'About',
    path: '/about',
  },
];

const blogPostUrlRegex = /\/blog\/\d{4}\/(.*?)\//;
const blogListUrlRegex = /\/blog\/(\w{2,})\/?/;

export class Header extends React.Component<{
  postsContext: IPostContext,
  className?: string,
}> {
  public render(): ReactElement {
    const { className } = this.props;

    return (
      <header
        className = { classnames(cnHeader(), className) }
      >
        <nav
          className = { cnHeader('Nav') }
        >
          <ol
            className = { cnHeader('List') }
          >
            { this.getTopMenuList() }
          </ol>
        </nav>
      </header>
    );
  }

  /**
   * Returns style object for active (current) links.
   * Has two cases:
   *  - full and partial match
   *  - tries to match post page to the tag post list
   */
  private getActiveLinkProps = (
    { href, location, isCurrent, isPartiallyCurrent }: LinkGetProps,
  ): { style: Record<string, string> } | undefined => {
    const positiveMatchProps = {
      // can't add className here cause it messes up themeUI one
      style: {
        backgroundColor: '#e2e8f0',
      },
    };

    // full match and partial match
    if (isCurrent || isPartiallyCurrent) {
      return positiveMatchProps;
    }


    const blogListMatch = blogListUrlRegex.exec(href);

    if (!blogListMatch) {
      return;
    }

    const { pathname } = location;

    if (!blogPostUrlRegex.test(pathname)) {
      return;
    }

    // at this point pathname is actually slug of the post
    const postSlug = pathname;

    const [, tag] = blogListMatch;

    const { postsPerTag } = this.props.postsContext;

    // if post belongs to more than one top-level tags
    // both will get highlighted in the header
    if (postsPerTag.has(tag)) {
      const postSlugs =
        postsPerTag.get(tag)!
          .map(({ fields: { slug } }) => slug);

      if (postSlugs.includes(postSlug)) {
        return positiveMatchProps;
      }
    }
  };

  private getTopMenuList(): ReactElement[] {
    return topSections.map(({ name, path }) => {
      return (
        <li
          key = { name }
        >
          <Styled.a
            as = { Link }
            className = { cnHeader('Link') }
            getProps = { this.getActiveLinkProps }
            to = { path }
          >
            { name }
          </Styled.a>
        </li>
      );
    });
  }
}
