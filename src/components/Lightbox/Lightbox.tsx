import React, { ReactElement, useContext } from 'react';
import { default as LightboxReact } from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { cn } from '@bem-react/classname';

import {
  ILightboxImage,
  lightboxActionsContext,
} from '../../react-contexts/lightbox-actions.context';

import { lightboxStateContext } from '../../react-contexts/lightbox-state.context';
import { LightboxImageTitle } from './LightboxImageTitle/LightboxImageTitle';

import './Lightbox.scss';

interface ILightboxProps {
  mainSrc: string;
  imageTitle?: ReactElement;
  prevSrc?: string;
  nextSrc?: string;
  prevLabel?: string;
  nextLabel?: string;
}

/**
 * Figures lightbox props by active image src and map of images.
 * Includes previous and next image sources, labels, etc.
 */
export function getLightboxPropsByImageSrc(
  images: Map<string, ILightboxImage>,
  src: string,
): ILightboxProps {
  // closed case
  if (src === '') {
    return { mainSrc: '' };
  }

  const { title } = images.get(src) as ILightboxImage;
  // not very efficient approach
  const index = Array.from(images.keys()).indexOf(src) + 1;

  const props = {
    mainSrc: src,
    imageTitle: (
      <LightboxImageTitle
        title = { title! }
        index = { index }
        length = { images.size }
      />
    ),
  };

  const keys = Array.from(images.keys());
  const maxIndex = keys.length - 1;

  // single image case
  if (maxIndex === 0) {
    return props;
  }

  const currentIndex = keys.indexOf(src);

  const previousIndex = currentIndex !== 0 ? currentIndex - 1 : maxIndex;
  const nextIndex = currentIndex !== maxIndex ? currentIndex + 1 : 0;

  const previousImage = images.get(keys[previousIndex]);
  const nextImage = images.get(keys[nextIndex]);

  return {
    ...props,
    prevSrc: previousImage?.src,
    prevLabel: previousImage?.title,
    nextSrc: nextImage?.src,
    nextLabel: nextImage?.title,
  };
}

const cnLightbox = cn('Lightbox');

export function Lightbox(): ReactElement | null {
  const { images, activeSrc } = useContext(lightboxStateContext);
  const { current: { close, openAt } } = useContext(lightboxActionsContext);

  if (!activeSrc) {
    return null;
  }

  const reactModalProps = {
    testId: cnLightbox('Portal-Content'),
    htmlOpenClassName: cnLightbox('HTML', { open: true }),
  };

  const lightboxProps = getLightboxPropsByImageSrc(images, activeSrc);

  return (
    <LightboxReact
      { ...lightboxProps }
      enableZoom = { false }
      reactModalProps = { reactModalProps }
      closeLabel = 'Close Image Gallery'
      onMovePrevRequest = { () => lightboxProps.prevSrc && openAt(lightboxProps.prevSrc) }
      onMoveNextRequest = { () => lightboxProps.nextSrc && openAt(lightboxProps.nextSrc) }
      onCloseRequest = { () => close() }
    />
  );
}
