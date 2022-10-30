import React, {
  ReactElement,
  useRef,
  useState,
} from 'react';

import {
  ILightboxImage,
  ILightboxActions,
  lightboxActionsContext,
} from '../react-contexts/lightbox-actions.context';

import {
  ILightboxState,
  lightboxStateContext,
} from '../react-contexts/lightbox-state.context';

export function LightboxContextProvider(
  { children }: { children: ReactElement },
): ReactElement {
  const [state, setState] = useState<ILightboxState>({
    images: new Map(),
    activeSrc: '',
  });

  const { images } = state;

  const imageActions = {
    addImage(image: ILightboxImage) {
      if (images.has(image.src)) {
        return;
      }

      images.set(image.src, image);

      setState({
        ...state,
      });
    },
    removeImage(imageSrc: string) {
      if (!images.has(imageSrc)) {
        return;
      }

      images.delete(imageSrc);

      setState({
        ...state,
      });
    },
    close() {
      setState({
        ...state,
        activeSrc: '',
      });
    },
    openAt(imageSrc: string) {
      setState({
        ...state,
        activeSrc: imageSrc,
      });
    },
  };

  const imageActionsRef = useRef<ILightboxActions>(imageActions);

  return (
    <lightboxActionsContext.Provider
      value = { imageActionsRef }
    >
      <lightboxStateContext.Provider
        value = { state }
      >
        { children }
      </lightboxStateContext.Provider>
    </lightboxActionsContext.Provider>
  );
}
