import React, { ReactElement, useState } from 'react';
import { navigate, PageRendererProps } from 'gatsby';
import { cn } from '@bem-react/classname';
import { classnames } from '@bem-react/classnames';
import { snakeCase } from 'lodash';
import {
  AppBar,
  IconButton,
  Menu,
  PaperProps,
  Tab,
  Tabs,
  Toolbar,
} from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import {
  RssFeed as RssFeedIcon,
  Twitter as TwitterIcon,
  Menu as MenuIcon,
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

/**
 * Return list of tabs. On small screens show active tab only.
 */
function getMenuTabs(
  selectedTabPath: string | false,
  activeTabOnly = false,
): ReactElement[] {
  const tabs = [];

  for (const section of topSections) {
    const { name, path, testId } = section;

    const isActive = path === selectedTabPath;

    if (activeTabOnly && !isActive) {
      continue;
    }

    const completeTestId = cnHeader('Tab', {
      active: isActive,
      [testId]: true,
    });

    tabs.push(
      <Tab
        data-testid = { completeTestId }
        key = { name }
        value = { path }
        label = { name }
      >
      </Tab>
    );
  }

  return tabs;
}

/**
 * Activate navigation action.
 */
function onTabSelect(event: unknown, value: string): void {
  navigate(value);
}

/**
 * Return selected/active tab path.
 * There are three cases:
 *  - full and partial match
 *  - index page (tech posts, page 1)
 *  - match post page (when applicable) to the tag post list
 */
function getSelectedTabPath(
  activePath: string,
  postsContext: IPostContext,
): string | false {
  for (const section of topSections) {
    const { path } = section;

    if (activePath.startsWith(path)) {
      return path;
    }
  }

  if (activePath === '/') {
    return getPostListUrlByTag(indexPageTag);
  }

  if (postUrlRegex.test(activePath)) {
    const { postsPerTag } = postsContext;

    for (const section of topSections) {
      const { tag } = section;

      // if post belongs to more than one top-level tags
      // first will get highlighted in the header
      if (tag && postsPerTag.has(tag)) {
        const postPaths =
          postsPerTag.get(tag)!
            .map(({ fields: { slug } }) => slug);

        if (postPaths.includes(activePath)) {
          return section.path;
        }
      }
    }
  }

  return false;
}

export function Header(props: IHeaderProps): ReactElement {
  const {
    className,
    postsContext,
    location,
  } = props;

  const { pathname: activePath } = location;

  const selectedTabPath = getSelectedTabPath(activePath, postsContext);

  const theme = useTheme();
  const largeScreen = useMediaQuery(theme.breakpoints.up('md'));

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const menuIsOpen = !!menuAnchor && !largeScreen;

  if (menuAnchor && largeScreen) {
    setMenuAnchor(null);
  }

  function openMenu(event: React.MouseEvent<HTMLElement>): void {
    setMenuAnchor(event.currentTarget);
  }

  function closeMenu(): void {
    setMenuAnchor(null);
  }

  /**
   * Close menu and head to the link target.
   */
  function onMenuItemClick(event: unknown, value: string): void {
    onTabSelect(event, value);
    closeMenu();
  }

  const buttons = [
    <IconButton
      disabled
      key = 'rss'
      color = 'inherit'
      aria-label = 'menu'
    >
      <RssFeedIcon/>
    </IconButton>,
    <IconButton
      key = 'twitter'
      href = 'https://twitter.com/amalitsky'
      edge = 'end'
      color = 'inherit'
      aria-label = 'menu'
      component = 'a'
    >
      <TwitterIcon/>
    </IconButton>,
  ];

  const tabs = (
    <Tabs
      scrollButtons = 'on'
      value = { selectedTabPath }
      onChange = { onTabSelect }
    >
      { getMenuTabs(selectedTabPath, !largeScreen) }
    </Tabs>
  );

  const menuPaperProps: PaperProps = {
    square: true,
  };

  const MenuTemplate = (
    <>
      <IconButton
        className = { cnHeader('MenuButton') }
        edge = 'start'
        color = 'inherit'
        aria-label = 'menu'
        onClick = { openMenu }
      >
        <MenuIcon/>
      </IconButton>
      <Menu
        id = 'app-menu'
        anchorReference = 'anchorPosition'
        anchorPosition = {{
          top: 0,
          left: 0,
        }}
        marginThreshold = { 0 }
        PaperProps = { menuPaperProps }
        keepMounted
        open = { menuIsOpen }
        onClose = { closeMenu }
      >
        <div className = { cnHeader('MenuItems') }>
          <Tabs
            orientation = 'vertical'
            value = { selectedTabPath }
            onChange = { onMenuItemClick }
          >
            { getMenuTabs(selectedTabPath) }
          </Tabs>
        </div>
      </Menu>
    </>
  );

  return (
    <AppBar
      position = 'static'
      data-testid = { cnHeader() }
      className = { classnames(cnHeader(), className) }
    >
      <Toolbar
        variant = 'dense'
      >
        { largeScreen ? null : MenuTemplate }
        { tabs }
        <div
          className = { cnHeader('IconWrapper') }
        >
          { buttons }
        </div>
      </Toolbar>
    </AppBar>
  );
}
