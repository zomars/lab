import React, { ReactElement } from 'react';
import { kebabCase } from 'lodash';
import { cn } from '@bem-react/classname';
import { Link as LinkIcon } from '@material-ui/icons';

import './MDXHeader.scss';

type THeaderTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface IMDXHeaderProps {
  children: string, // text content of the header
}

// have to use factory since MDX doesn't pass header level as prop
function headerFactory(type: number): (props: IMDXHeaderProps) => ReactElement {
  const cnHeader = cn('MDXHeader');

  return function MDXHeader(props: IMDXHeaderProps): ReactElement {
    const anchorId = kebabCase(props.children);
    const Tag = `h${type}` as THeaderTag; // so that TS doesn't throw TS2322

    return (
      <Tag
        className = { cnHeader() }
      >
        <a
          className = { cnHeader('ChainLink') }
          href = { `#${ anchorId }` }
        >
          <LinkIcon
            className = { cnHeader('ChainLinkIcon') }
            fontSize = 'small'
          />
        </a>
        <a
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
