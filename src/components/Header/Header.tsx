import { Styled } from 'theme-ui';

import React, { ReactElement } from 'react';
import { Link } from 'gatsby';
import { cn } from '@bem-react/classname';

const cnHeader = cn('Header');

import './Header.scss';

const BLOG_INDEX_PATH = '/';

const topSections = [
  {
    name: 'Posts',
    path: BLOG_INDEX_PATH,
  }, {
    name: 'Projects',
    path: '/projects',
  }, {
    name: 'Tech Books',
    path: '/tech-books',
  }, {
    name: 'Blogs to Follow',
    path: '/tech-books',
  },
];

export class Header extends React.Component {
  public render(): ReactElement {
    const { className } = this.props as any;
    const fullClassName = `${ cnHeader() } ${ className || '' }`;

    return (
      <header
        className={ fullClassName }
      >
        <nav
          className={ cnHeader('Nav')}
        >
          <ol>
            { this.getTopMenuList_() }
          </ol>
        </nav>
      </header>
    )
  };

  protected getTopMenuList_(): ReactElement[] {
    const { location } = this.props as any;
    const { pathname } = location;
    const onRootPage = pathname === '/';

    return topSections.map(({ name, path }: any) => {
      const blogIndexPage = path === BLOG_INDEX_PATH;
      const activeState = path === pathname || blogIndexPage && onRootPage;
      const linkPath = onRootPage && blogIndexPage ? '/' : path;

      return (
          <li
            key = { name }
          >
            <Styled.a
              as = { Link }
              className = { cnHeader('Link') }
              activeClassName = { cnHeader('Link', { active: true }) }
              partiallyActive = { false }
              to = { linkPath }>
              { name }
            </Styled.a>
          </li>
      );
    });
  }
}
