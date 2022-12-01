import React, { ReactElement } from 'react';

import { cn } from '@bem-react/classname';
import { classnames } from '@bem-react/classnames';

import { LikeButton } from './Buttons/LikeButton';
import { ShareButton } from './Buttons/ShareButton/ShareButton';
import { ScrollToTheTopButton } from './Buttons/ScrollToTheTopButton';

import './PostSideMenu.scss';

const cnPostSideMenu = cn('PostSideMenu');

interface IPostSideMenuProps {
  className?: string;
  postPath: string;
  postHeader: string;
  layout?: 'horizontal' | 'vertical';
  postMetaDescription?: string;
}

export function PostSideMenu(props: IPostSideMenuProps): ReactElement {
  const {
    postHeader,
    postPath,
    layout,
    postMetaDescription,
  } = props;

  /* eslint-disable react/jsx-key */
  const buttons = [
    <ScrollToTheTopButton
      path = { postPath }
      title = { postHeader }
    />,
    <ShareButton
      path = { postPath }
      title = { postHeader }
      summary = { postMetaDescription }
    />,
    <LikeButton
      path = { postPath }
      title = { postHeader }
    />,
    /* <IconButton
      color = 'primary'
      title = 'Ask a Question or Send a Message'
    >
      <MessageIcon
        fontSize = 'inherit'
      />
    </IconButton>, */
  ];
  /* eslint-enable react/jsx-key */

  const horizontalLayout = layout === 'horizontal';

  return (
    <menu
      className = {
        classnames(props.className, cnPostSideMenu({
          horizontal: horizontalLayout,
          vertical: !horizontalLayout,
        }))
      }
    >

      {
        buttons.map((Button, index) => {
          return (
            <li
              key = { index }
              className = { cnPostSideMenu('ListElement') }
            >
              { Button }
            </li>
          );
        })
      }

    </menu>
  );
}
