import React from 'react';
import { ILightboxImage } from './lightbox-actions.context';

export interface ILightboxState {
  images: Map<string, ILightboxImage>;
  activeSrc: string;
}

export const lightboxStateDefault: ILightboxState = {
  images: new Map(),
  activeSrc: '',
};

export const lightboxStateContext = React.createContext(lightboxStateDefault);

lightboxStateContext.displayName = 'LightboxStateContext';
