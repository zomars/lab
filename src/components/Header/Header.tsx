import React, { ReactElement } from 'react';
import { navigate, PageRendererProps } from 'gatsby';
import { cn } from '@bem-react/classname';
import { classnames } from '@bem-react/classnames';
import { snakeCase } from 'lodash';
import {
  AppBar,
  Toolbar,
  IconButton,
  Tabs,
  Tab,
} from '@material-ui/core';

import {
  RssFeed as RssFeedIcon,
  Twitter as TwitterIcon,
} from '@material-ui/icons';

import { IPostContext } from '../../react-contexts/posts.context';
import { indexPageTag } from '../../constants';
import { getPostListUrlByTag } from '../../services/urls.service';

import './Header.scss';

const cnHeader = cn('Header');

interface ISection {
  name: string;
  path: string;
  testId: string;
  tag?: string;
}

const topSections = [
  {
    name: 'Tech Posts',
    tag: 'tech',
  }, {
    name: 'Car Posts',
    tag: 'cars',
  }, {
    name: 'Sources',
    path: '/sources/',
  }, {
    name: 'About',
    path: '/about/',
  },
] as ISection[];

topSections.forEach((section: ISection) => {
  section.testId = snakeCase(section.name);
  const { tag } = section;

  if (tag) {
    section.path = getPostListUrlByTag(tag);
  }
});

const postUrlRegex = /^\/blog\/posts\/.+$/;

interface IHeaderProps extends PageRendererProps {
  postsContext: IPostContext,
  className?: string,
}

export class Header extends React.Component<IHeaderProps> {
  /**
   * There are three cases:
   *  - full and partial match
   *  - index page (tech posts, page 1)
   *  - match post page (when applicable) to the tag post list
   */
  public get selectedTab(): string | false {
    const { pathname } = this.props.location;

    for (const section of topSections) {
      const { path } = section;

      if (pathname.startsWith(path)) {
        return path;
      }
    }

    if (pathname === '/') {
      return getPostListUrlByTag(indexPageTag);
    }

    if (postUrlRegex.test(pathname)) {
      const { postsPerTag } = this.props.postsContext;

      for (const section of topSections) {
        const { tag } = section;

        // if post belongs to more than one top-level tags
        // first will get highlighted in the header
        if (tag && postsPerTag.has(tag)) {
          const postPaths =
            postsPerTag.get(tag)!
              .map(({ fields: { slug } }) => slug);

          if (postPaths.includes(pathname)) {
            return section.path;
          }
        }
      }
    }

    return false;
  }

  public render(): ReactElement {
    const { className } = this.props;

    return (
      <AppBar
        position = 'static'
        data-testid = { cnHeader() }
        className = { classnames(cnHeader(), className) }
      >
        <Toolbar
          variant = 'dense'
        >
          <Tabs
            scrollButtons = 'on'
            value = { this.selectedTab }
            onChange = { this.onTabSelect }
          >
            { this.getMenuTabs() }
          </Tabs>
          <div
            className = { cnHeader('IconWrapper') }
          >
            <IconButton
              color = 'inherit'
              aria-label = 'menu'
            >
              <RssFeedIcon/>
            </IconButton>
            <IconButton
              href = 'https://twitter.com/amalitsky'
              edge = 'end'
              color = 'inherit'
              aria-label = 'menu'
              component = 'a'
            >
              <TwitterIcon/>
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
    );
  }

  private onTabSelect = (event: unknown, value: string): void => {
    navigate(value);
  };

  // eslint-disable-next-line class-methods-use-this
  private getMenuTabs(): ReactElement[] {
    return topSections.map(
      ({ name, path, testId }) => {
        const completeTestId = cnHeader('Tab', {
          selected: path === this.selectedTab,
          [testId]: true,
        });

        return (
          <Tab
            data-testid = { completeTestId }
            key = { name }
            value = { path }
            label = { name }
          >
          </Tab>
        );
      });
  }
}
