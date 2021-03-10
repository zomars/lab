/** @jsx jsx */
import { jsx, ThemeProvider } from 'theme-ui';
import React, { ReactElement } from 'react';
import { graphql, Link, StaticQuery } from 'gatsby';
import { cn } from '@bem-react/classname';

const cnHeader = cn('Header');

import './Header.scss';

const BLOG_INDEX_PATH = '/blog';

const topSections = [
  {
    name: 'Blog',
    path: BLOG_INDEX_PATH,
  }, {
    name: 'About',
    path: '/about',
  },
];

export class Header extends React.Component {
  public render(): ReactElement {
    return (
      <StaticQuery
        query = { pageQuery }
        render = { this.render_ }
      />
    );
  }

  protected render_ = (data: any): ReactElement => {
    const { className } = this.props as any;
    const fullClassName = `${ cnHeader() } ${ className }`;
    const { shortTitle } = data.site.siteMetadata;

    return (
      <header
        className={ fullClassName }
      >
        <ul>
          { this.getTopMenuList_() }
        </ul>
        <div
          className={ cnHeader('Logo') }>
          <Link
            className={ cnHeader('Link') }
            to={ `/` }>
            { shortTitle }
          </Link>
        </div>
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
          className = {
            cnHeader('Link-Wrapper', { active: activeState })
          }
        >
          <Link
            className = { cnHeader('Link') }
            activeClassName = { cnHeader('Link', { active: true }) }
            to = { linkPath }>
            { name }
          </Link>
        </li>
      );
    })
  }
}

export const pageQuery = graphql`
  query PageQuery {
    site {
      siteMetadata {
        shortTitle
      }
    }
  }
`;
