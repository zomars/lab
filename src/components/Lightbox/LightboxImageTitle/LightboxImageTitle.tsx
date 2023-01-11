import React, { ReactElement } from 'react';
import { cn } from '@bem-react/classname';

import './LightboxImageTitle.scss';

interface ILightboxImageTitleProps {
  title: string;
  index: number;
  length: number;
}

const cnLightboxImageTitle = cn('LightboxImageTitle');

export function LightboxImageTitle(
  props: ILightboxImageTitleProps,
): ReactElement {
  const {
    title,
    index,
    length,
  } = props;

  return (
    <div
      className = { cnLightboxImageTitle() }
      data-testid = { cnLightboxImageTitle() }
    >
      <div
        data-testid = { cnLightboxImageTitle('IndexOf') }
        className = { cnLightboxImageTitle('IndexOf') }
      >
        { `${ index } / ${ length }` }
      </div>
      <div
        data-testid = { cnLightboxImageTitle('Title') }
      >
        { title }
      </div>
    </div>
  );
}
