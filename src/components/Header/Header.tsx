import React, { ReactElement } from 'react';
import { Link } from 'gatsby';
import { cn } from '@bem-react/classname';
import { classnames } from '@bem-react/classnames';
import { LinkGetProps } from '@reach/router'; // peer dependency through gatsby
import { snakeCase } from 'lodash';

import { IPostContext } from '../../react-contexts/posts.context';

import './Header.scss';

const cnHeader = cn('Header');

interface ISection {
  name: string;
  path: string;
  testId: string;
}

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
] as ISection[];

topSections.forEach((section: ISection) => {
  section.testId = snakeCase(section.name);
});

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
        data-testid = { cnHeader() }
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
  ): { style: Record<string, string> } | Record<string, unknown> => {
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
      return {};
    }

    const { pathname } = location;

    if (!blogPostUrlRegex.test(pathname)) {
      return {};
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

    return {};
  };

  private getTopMenuList(): ReactElement[] {
    return topSections.map(
      ({ name, path, testId }, index: number) => {
        return (
          <li
            data-testid = { cnHeader(testId) }
            key = { name }
          >
            <Link
              className = { cnHeader('Link', { first: !index }) }
              getProps = { this.getActiveLinkProps }
              to = { path }
            >
              { name }
            </Link>
          </li>
        );
      });
  }
}
