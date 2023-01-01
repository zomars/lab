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
} from 'react-share';

import { cn } from '@bem-react/classname';
import { classnames } from '@bem-react/classnames';

import { useSiteMetadata } from '../../../../hooks/useSiteMetadata.hook';

import { CopyUrlButton } from './CopyUrlButton/CopyUrlButton';

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
  const testId = cnSocialButtons('Button');

  return (
    <>
      <TwitterShareButton
        url = { url }
        title = { title }
        via = { twitterHandle }
        className = { className }
        data-testid = { testId }
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
        data-testid = { testId }
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
        data-testid = { testId }
        onClick = { () => onSocialShareClick('linkedin') }
      >
        <LinkedinIcon
          size = { iconSize }
          round = { true }
        />
      </LinkedinShareButton>

      <FacebookShareButton
        url = { url }
        title = { title }
        className = { className }
        data-testid = { testId }
        onClick = { () => onSocialShareClick('facebook') }
      >
        <FacebookIcon
          size = { iconSize }
          round = { true }
        />
      </FacebookShareButton>

      <RedditShareButton
        title = { title }
        url = { url }
        className = { className }
        data-testid = { testId }
        onClick = { () => onSocialShareClick('reddit') }
      >
        <RedditIcon
          size = { iconSize }
          round = { true }
        />
      </RedditShareButton>

      <CopyUrlButton
        className = { className }
        data-testid = { testId }
        onClick = { () => onSocialShareClick('copy_url') }
      />

      <EmailShareButton
        url = { url }
        subject = { title }
        className = { className }
        data-testid = { testId }
        onClick = { () => onSocialShareClick('email') }
      >
        <EmailIcon
          size = { iconSize }
          round = { true }
        />
      </EmailShareButton>
    </>
  );
}
