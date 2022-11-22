import React, {
  forwardRef,
  MouseEvent,
  ReactElement,
  Ref,
} from 'react';

import { cn } from '@bem-react/classname';
import { classnames } from '@bem-react/classnames';

import {
  EGtmEventTypes,
  IEGtmEventPayloads,
  gtmEventEmitter,
} from '../../services/gtm-event-emitter';

interface IOutboundLinkProps {
  onClick?: (event: MouseEvent) => unknown;
  target?: HTMLAnchorElement['target'];
  href: HTMLAnchorElement['href'];
  'data-testid'?: string;
  className?: string;
  children: string | ReactElement[];
  title?: string;
}

// Loosely based on
// https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby-plugin-google-gtag/src/index.js

const cnOutboundLinkComponent = cn('OutboundLinkComponent');

function OutboundLinkComponent(
  {
    children,
    className,
    'data-testid': dataTestId,
    target: propsTarget,
    onClick: onClickProp,
    ...props
  }: IOutboundLinkProps,
  ref: Ref<HTMLAnchorElement>,
): ReactElement {
  const target = propsTarget || '_blank';

  function onClick(e: MouseEvent): boolean {
    if (typeof onClickProp === 'function') {
      try {
        onClickProp(e);
      } catch (e) {
        console.error(e);
      }
    }

    let redirect = true;

    if (
      e.button !== 0 ||
      e.altKey || e.ctrlKey || e.metaKey || e.shiftKey ||
      e.defaultPrevented
    ) {
      redirect = false;
    }

    const { href } = props;

    if (target?.toLowerCase() !== '_self') {
      redirect = false;
    }

    let url;

    // href has to be absolute hence try...catch
    try {
      url = new URL(href);
    } catch (e) {
      console.error(e);
    }

    const gtmEventPayload = {
      outbound_link_url: props.href,
      outbound_link_domain: url?.hostname,
    } as IEGtmEventPayloads[EGtmEventTypes.outbound_link_click];

    if (typeof children === 'string') {
      gtmEventPayload.outbound_link_label = children;
    } else {
      console.log('Can\'t read link label from list of ReactElements');
    }

    gtmEventEmitter(EGtmEventTypes.outbound_link_click, gtmEventPayload);

    if (redirect) {
      document.location = props.href;
    }

    return false;
  }

  return (
    <a
      ref = { ref }
      target = { target }
      data-testid = { classnames(cnOutboundLinkComponent(), dataTestId) }
      className = { classnames(cnOutboundLinkComponent(), className) }
      onClick = { e => onClick(e) }
      { ...props }
    >
      { children }
    </a>
  );
}

export const OutboundLink = forwardRef(OutboundLinkComponent);
