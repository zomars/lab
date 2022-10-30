import React from 'react';

export interface ILightboxImage {
  src: string;
  title?: string;
  caption?: string;
}

export interface ILightboxActions {
  addImage(image: ILightboxImage): void;
  removeImage(src: string): void;
  openAt(src: string): void;
  close(): void;
}

export const lightboxActionsDefault: ILightboxActions = {
  /* eslint-disable @typescript-eslint/no-empty-function */
  addImage() {},
  removeImage() {},
  openAt() {},
  close() {},
  /* eslint-enable @typescript-eslint/no-empty-function */
};

export const lightboxActionsContext =
  React.createContext({ current: lightboxActionsDefault });

lightboxActionsContext.displayName = 'LightboxActionsContext';
