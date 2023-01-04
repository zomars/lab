import { cn } from '@bem-react/classname';
import { Link as LinkIcon } from '@mui/icons-material';
import { useLocation } from '@reach/router';
import { kebabCase } from 'lodash';

import React, {
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { EGtmEventTypes, gtmEventEmitter } from '../../services/gtm-event-emitter';
import { IReactNodeProps } from '../../types/common.types';

import './MdxHeader.scss';

type THeaderTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface IMdxHeaderProps extends IReactNodeProps {
  children?: ReactElement[] | string; // text content of the header
}

function useAnchorId(
  children: IMdxHeaderProps['children'],
  element: { current: HTMLAnchorElement | null },
): string {
  const [anchorId, setAnchorId] = useState<string>(
    kebabCase(typeof children === 'string' ? children : '')
  );

  const { hash } = useLocation();

  // we don't watch location hash in useEffect since we care about initial rendering
  // only and use it to pick up the hash from the URL on initial page load
  // we assume that user won't have time to update the hash between render and useEffect
  // we don't watch for anchorId updates because we set it here (at most once)
  useEffect(() => {
    // nothing to do here when header was passed as a simple string
    if (anchorId || !element.current) {
      return;
    }

    // otherwise we read innerText from DOM and
    // - rerender the component via setAnchorId
    // - scroll to the element if there was a hash match
    const elementAnchorId = kebabCase(element.current.innerText);

    // when anchorId is set from useEffect, browser's hash lookup WILL fail
    // hence we need to check it manually and scroll into the view if match was hit
    if (hash && hash === `#${ elementAnchorId }`) {
      element.current.scrollIntoView();
    }

    setAnchorId(elementAnchorId);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return anchorId;
}

// have to use factory since MDX doesn't pass header level as prop
function headerFactory(type: number): (props: IMdxHeaderProps) => ReactElement {
  const cnHeader = cn('MdxHeader');

  return function MdxHeader(props: IMdxHeaderProps): ReactElement {
    const Tag = `h${type}` as THeaderTag; // so that TS doesn't throw TS2322

    const element = useRef<HTMLAnchorElement>(null);
    const anchorId = useAnchorId(props.children, element);

    const onClick = useCallback(() => {
      gtmEventEmitter(EGtmEventTypes.header_anchor_link_click, {
        header_anchor_id: anchorId,
        header_text: element.current!.innerText || '',
      });
    }, [
      element,
      anchorId,
    ]);

    return (
      <Tag
        className = { cnHeader({ [Tag]: true }) }
        data-testid = { cnHeader({ [Tag]: true }) }
      >
        <a
          className = { cnHeader('ChainLink') }
          data-testid = { cnHeader('ChainLink') }
          aria-label = 'Header Anchor Link'
          href = { `#${ anchorId }` }
        >
          <LinkIcon
            onClick = { onClick }
            className = { cnHeader('ChainLinkIcon') }
            fontSize = 'small'
          />
        </a>
        <a
          ref = { element }
          className = { cnHeader('Anchor') }
          id = { anchorId }
          { ...props }
        />
      </Tag>
    );
  };
}

export const H1 = headerFactory(1);
export const H2 = headerFactory(2);
export const H3 = headerFactory(3);
export const H4 = headerFactory(4);
export const H5 = headerFactory(5);
export const H6 = headerFactory(6);
