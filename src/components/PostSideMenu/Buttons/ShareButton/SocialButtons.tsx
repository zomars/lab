import React, { ReactElement } from 'react';

import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  RedditIcon,
  RedditShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from 'react-share';

import { cn } from '@bem-react/classname';
import { classnames } from '@bem-react/classnames';

import { useSiteMetadata } from '../../../../hooks/useSiteMetadata.hook';

interface ISocialButtons {
  url: string;
  title: string;
  summary?: string;
  iconSize: number;
  buttonClassName?: string;
  onSocialShareClick: (social: string) => void;
}

const cnSocialButtons = cn('SocialButtons');

export function SocialButtons(props: ISocialButtons): ReactElement {
  const {
    summary,
    title,
    onSocialShareClick,
    url,
    iconSize,
    buttonClassName,
  } = props;

  const {
    title: siteTitle,
    social: {
      twitter: twitterHandle,
    },
  } = useSiteMetadata();

  const className = classnames(cnSocialButtons('Button'), buttonClassName);

  return (
    <>
      <TwitterShareButton
        url = { url }
        title = { title }
        via = { twitterHandle }
        className = { className }
        onClick = { () => onSocialShareClick('twitter') }
      >
        <TwitterIcon
          size = { iconSize }
          round = { true }
        />
      </TwitterShareButton>
      <TelegramShareButton
        title = { title }
        url = { url }
        className = { className }
        onClick = { () => onSocialShareClick('telegram') }
      >
        <TelegramIcon
          size = { iconSize }
          round = { true }
        />
      </TelegramShareButton>
      <LinkedinShareButton
        url = { url }
        title = { title }
        source = { siteTitle }
        summary = { summary }
        className = { className }
        onClick = { () => onSocialShareClick('linkedin') }
      >
        <LinkedinIcon
          size = { iconSize }
          round = { true }
        />
      </LinkedinShareButton>
      <FacebookShareButton
        url = { url }
        className = { className }
        onClick = { () => onSocialShareClick('facebook') }
      >
        <FacebookIcon
          size = { iconSize }
          round = { true }
        />
      </FacebookShareButton>
      <EmailShareButton
        url = { url }
        subject = { title }
        className = { className }
        onClick = { () => onSocialShareClick('email') }
      >
        <EmailIcon
          size = { iconSize }
          round = { true }
        />
      </EmailShareButton>
      <RedditShareButton
        title = { title }
        url = { url }
        className = { className }
        onClick = { () => onSocialShareClick('reddit') }
      >
        <RedditIcon
          size = { iconSize }
          round = { true }
        />
      </RedditShareButton>
      <WhatsappShareButton
        url = { url }
        title = { title }
        className = { className }
        onClick = { () => onSocialShareClick('whatsapp') }
      >
        <WhatsappIcon
          size = { iconSize }
          round = { true }
        />
      </WhatsappShareButton>
    </>
  );
}
