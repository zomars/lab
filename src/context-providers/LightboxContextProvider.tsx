import React, {
  ReactElement,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  ILightboxImage,
  lightboxActionsContext,
} from '../react-contexts/lightbox-actions.context';

import { ILightboxState, lightboxStateContext } from '../react-contexts/lightbox-state.context';
import { EGtmEventTypes, gtmEventEmitter } from '../services/gtm-event-emitter';
import { toFixedNumber } from '../services/to-fixed-number';

export function LightboxContextProvider(
  { children }: { children: ReactElement },
): ReactElement {
  const [state, setState] = useState<ILightboxState>({
    images: new Map(),
    activeSrc: '',
  });

  const { images } = state;

  const imageActions = useMemo(() => ({
    addImage(image: ILightboxImage) {
      if (images.has(image.src)) {
        return;
      }

      images.set(image.src, image);

      setState(prevState => ({
        ...prevState,
      }));
    },
    removeImage(imageSrc: string) {
      if (!images.has(imageSrc)) {
        return;
      }

      images.delete(imageSrc);

      setState(prevState => ({
        ...prevState,
      }));
    },
    close() {
      setState((prevState) => {
        gtmEventEmitter(EGtmEventTypes.image_grid_lightbox_close, {
          lightbox_image_src: prevState.activeSrc,
        });

        return {
          ...prevState,
          activeSrc: '',
        };
      });
    },
    openAt(imageSrc: string) {
      gtmEventEmitter(EGtmEventTypes.image_grid_lightbox_view, {
        lightbox_image_src: imageSrc,
        lightbox_image_weight: toFixedNumber(1 / images.size, 4),
      });

      setState(prevState => ({
        ...prevState,
        activeSrc: imageSrc,
      }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), []);

  const imageActionsRef = useRef(imageActions);

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
