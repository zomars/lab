import React, { ReactElement } from 'react';
import { cn } from '@bem-react/classname';
import { classnames } from '@bem-react/classnames';
import { Link } from 'gatsby';
import { OutboundLink } from '../OutboundLink/OutboundLink';

interface IMdxLinkProps {
  children: string | ReactElement[];
  className?: string;
  href: string;
  title?: string; // mdx only
  target?: HTMLAnchorElement['target'];
}

const cnMdxLink = cn('MdxLink');

/**
 * Uses GatsbyLink for local (relative) links and OutboundLink for the rest.
 * Used by MDX content.
 */
export function MdxLink(props: IMdxLinkProps): ReactElement {
  const {
    children,
    className,
    title,
    href,
    target,
  } = props;

  if (href.startsWith('/')) {
    return (
      <Link
        title = { title }
        data-testid = { classnames(cnMdxLink(), className) }
        className = { classnames(cnMdxLink(), className) }
        to = { href }
      >
        { children }
      </Link>
    );
  } else {
    return (
      <OutboundLink
        data-testid = { classnames(cnMdxLink(), className) }
        className = { classnames(cnMdxLink(), className) }
        target = { target }
        href = { href }
        title = { title }
      >
        { children }
      </OutboundLink>
    );
  }
}
