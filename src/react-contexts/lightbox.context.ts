import React from 'react';

export interface ILightboxImage {
  src: string;
  title?: string;
  caption?: string;
}

export interface ILightboxState {
  images: Map<string, ILightboxImage>;
  activeSrc?: string;
}

interface IAddLightboxImage {
  type: 'add';
  image: ILightboxImage;
}

interface IRemoveLightboxImage {
  type: 'remove';
  imageSrc: string;
}

interface IOpenLightboxImage {
  type: 'open';
  imageSrc: string;
}

interface ICloseLightboxImage {
  type: 'close';
}

export type TLightboxContextAction = IAddLightboxImage | IRemoveLightboxImage |
IOpenLightboxImage | ICloseLightboxImage;

export const lightboxStateDefault: ILightboxState = {
  images: new Map(),
  activeSrc: '',
};

export const LightboxContext = React.createContext(lightboxStateDefault);

LightboxContext.displayName = 'LightboxStateContext';

export const LightboxDispatchContext =
  React.createContext<(action: TLightboxContextAction) => void>(() => undefined);

LightboxDispatchContext.displayName = 'LightboxDispatchContext';

export function lightboxContextReducer(
  context: ILightboxState,
  action: TLightboxContextAction,
): ILightboxState {
  const { images } = context;

  switch (action.type) {
    case 'add': {
      const { image } = action;
      const { src: imageSrc } = image;

      if (images.has(imageSrc)) {
        throw Error('Can\'t add image duplicate by src');
      }

      images.set(imageSrc, image);

      return {
        ...context,
      };
    }

    case 'remove': {
      const { imageSrc } = action;

      if (!images.has(imageSrc)) {
        throw Error('Can\'t remove image since src is not found');
      }

      images.delete(imageSrc);

      return {
        ...context,
      };
    }

    case 'open':
      return {
        ...context,
        activeSrc: action.imageSrc,
      };

    case 'close':
      return {
        ...context,
        activeSrc: undefined,
      };
  }
}
