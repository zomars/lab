import React, { ReactElement } from 'react';

import { cn } from '@bem-react/classname';
import { classnames } from '@bem-react/classnames';

import { LikeButton } from './Buttons/LikeButton';
import { ShareButton } from './Buttons/ShareButton/ShareButton';
import { ScrollToTheTopButton } from './Buttons/ScrollToTheTopButton';

import './PostSideMenu.scss';

const cnPostSideMenu = cn('PostSideMenu');

type buttonType = 'like' | 'scroll' | 'share';

interface IPostSideMenuProps {
  className?: string;
  layout?: 'horizontal' | 'vertical';
  buttons?: buttonType[];
}

export function PostSideMenu(props: IPostSideMenuProps): ReactElement {
  const { layout } = props;

  const buttonsHash = {
    scroll: <ScrollToTheTopButton/>,
    share: <ShareButton/>,
    like: <LikeButton/>,
    /* <IconButton
      color = 'primary'
      title = 'Ask a Question or Send a Message'
    >
      <MessageIcon
        fontSize = 'inherit'
      />
    </IconButton>, */
  };

  const buttonTypes = props.buttons || Object.keys(buttonsHash);

  const buttons = buttonTypes.map(type => buttonsHash[type]);

  const horizontalLayout = layout === 'horizontal';

  return (
    <menu
      className = {
        classnames(props.className, cnPostSideMenu({
          horizontal: horizontalLayout,
          vertical: !horizontalLayout,
        }))
      }
      data-testid = { cnPostSideMenu() }
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
