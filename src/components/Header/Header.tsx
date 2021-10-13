import React, { ReactElement, useState } from 'react';
import { navigate, PageRendererProps } from 'gatsby';
import { cn } from '@bem-react/classname';
import { classnames } from '@bem-react/classnames';
import {
  AppBar,
  IconButton,
  Menu,
  PaperProps,
  Toolbar,
  Fade,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import {
  RssFeed as RssFeedIcon,
  Twitter as TwitterIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';

import { IPostContext } from '../../react-contexts/posts.context';

import './Header.scss';
import { HeaderTabs } from './HeaderTabs/HeaderTabs';

const cnHeader = cn('Header');

interface IHeaderProps extends PageRendererProps {
  postsContext: IPostContext,
  className?: string,
}

/**
 * Have two views based on the screen width:
 *   - all tabs are rendered horizontally (large screens)
 *   - only active tab is rendered horizontally and the rest are rendered in the hamburger menu
 */
export function Header(props: IHeaderProps): ReactElement {
  const {
    className,
    postsContext,
    location,
  } = props;

  const { pathname: activePath } = location;

  const theme = useTheme();
  const largeScreen = useMediaQuery(theme.breakpoints.up('md'));

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  function closeMenu(): void {
    setMenuAnchor(null);
  }

  if (menuAnchor && largeScreen) {
    closeMenu();
  }

  const menuIsOpen = !!menuAnchor || largeScreen;

  function openMenu(event: React.MouseEvent<HTMLElement>): void {
    setMenuAnchor(event.currentTarget);
  }

  function onTabSelection(selectedPath: string): void {
    if (menuIsOpen) {
      closeMenu();
    }

    navigate(selectedPath);
  }

  const buttons = [
    <IconButton
      disabled
      key = 'rss'
      color = 'inherit'
      aria-label = 'RSS'
    >
      <RssFeedIcon/>
    </IconButton>,
    <IconButton
      key = 'twitter'
      href = 'https://twitter.com/amalitsky'
      edge = 'end'
      color = 'inherit'
      aria-label = 'Twitter'
      component = 'a'
    >
      <TwitterIcon/>
    </IconButton>,
  ];

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
        TransitionComponent = { Fade }
      >
        <div className = { cnHeader('MenuItems') }>
          <HeaderTabs
            activePath = { activePath }
            postsContext = { postsContext }
            onTabSelection = { onTabSelection }
            vertical = { true }
          />
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

        <HeaderTabs
          activePath = { activePath }
          postsContext = { postsContext }
          onTabSelection = { onTabSelection }
          activeTabOnly = { !largeScreen }
        />

        <div
          className = { cnHeader('IconWrapper') }
        >
          { buttons }
        </div>
      </Toolbar>
    </AppBar>
  );
}
