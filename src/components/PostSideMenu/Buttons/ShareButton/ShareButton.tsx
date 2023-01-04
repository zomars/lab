import React, {
  ReactElement,
  useCallback,
  useRef,
  useState,
} from 'react';

import { Reply as ReplyIcon } from '@mui/icons-material';
import { IconButton, Popover } from '@mui/material';

import { cn } from '@bem-react/classname';

import { useSiteMetadata } from '../../../../hooks/useSiteMetadata.hook';
import { EGtmEventTypes, gtmEventEmitter } from '../../../../services/gtm-event-emitter';
import { SocialButtons } from '../SocialButtons/SocialButtons';

import './ShareButton.scss';

const cnShareButton = cn('ShareButton');

interface IShareButtonProps {
  path: string;
  title: string;
  summary?: string;
}

export function ShareButton(props: IShareButtonProps): ReactElement {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const { siteUrl } = useSiteMetadata();

  const anchorOrigin = {
    horizontal: 'center',
    vertical: 'center',
  };

  const {
    path,
    title,
    summary,
  } = props;

  const url = `${ siteUrl }${ path }`;

  const openPopup = useCallback(() => {
    setPopupOpen(true);
  }, []);

  const closePopup = useCallback(() => {
    setPopupOpen(false);
  }, []);

  const onSocialShareClick = useCallback((social: string) => {
    gtmEventEmitter(EGtmEventTypes.post_share_click, {
      post_id: path,
      post_header: title,
      share_social_network: social,
    });
  }, [
    path,
    title,
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
        <SocialButtons
          url = { url }
          title = { title }
          summary = { summary }
          iconSize = { 32 } // has to match CSS
          buttonClassName = { cnShareButton('SocialButton') }
          onSocialShareClick = { onSocialShareClick }
        />
      </Popover>
    </>
  );
}
