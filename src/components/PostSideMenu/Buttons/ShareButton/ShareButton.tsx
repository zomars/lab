import React, {
  ReactElement,
  useCallback,
  useRef,
  useState,
} from 'react';

import { Reply as ReplyIcon } from '@mui/icons-material';
import { IconButton, Popover } from '@mui/material';
import { cn } from '@bem-react/classname';

import { usePost } from '../../../../hooks/usePost';
import { useSiteMetadata } from '../../../../hooks/useSiteMetadata.hook';
import { EGtmEventTypes, gtmEventEmitter } from '../../../../services/gtm-event-emitter';
import { SocialButtons } from '../SocialButtons/SocialButtons';

import './ShareButton.scss';

const cnShareButton = cn('ShareButton');

export function ShareButton(): ReactElement {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const { siteUrl } = useSiteMetadata();

  const anchorOrigin = {
    horizontal: 'center',
    vertical: 'center',
  };

  const post = usePost();

  const openPopup = useCallback(() => {
    setPopupOpen(true);
  }, []);

  const closePopup = useCallback(() => {
    setPopupOpen(false);
  }, []);

  const onSocialShareClick = useCallback((social: string) => {
    if (!post) {
      return;
    }

    const { path, title } = post;

    gtmEventEmitter(EGtmEventTypes.post_share_click, {
      post_id: path,
      post_header: title,
      share_social_network: social,
    });
  }, [
    post,
  ]);

  return (
    <>
      <IconButton
        color = 'primary'
        title = 'Share'
        ref = { buttonRef }
        onClick = { openPopup }
        data-testid = { cnShareButton() }
      >
        <ReplyIcon/>
      </IconButton>

      <Popover
        open = { popupOpen }
        anchorEl = { buttonRef.current }
        onClose = { closePopup }
        onClick = { closePopup }
        // @ts-ignore-next-line
        anchorOrigin = { anchorOrigin }
        // @ts-ignore-next-line
        transformOrigin = { anchorOrigin }
        className = { cnShareButton('Popover') }
        disableRestoreFocus = { true }
        data-testid = { cnShareButton('Popover') }
      >
        { post ?
          <SocialButtons
            url = { `${ siteUrl }${ post.path }` }
            title = { post.title }
            summary = { post.description }
            iconSize = { 32 } // has to match CSS
            buttonClassName = { cnShareButton('SocialButton') }
            onSocialShareClick = { onSocialShareClick }
          /> : null }
      </Popover>
    </>
  );
}
