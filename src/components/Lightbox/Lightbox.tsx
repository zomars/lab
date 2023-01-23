import React, {
  ReactElement,
  useCallback,
  useState,
} from 'react';
import { useLocation } from '@reach/router';
import { default as LightboxReact } from 'react-image-lightbox';

import { cn } from '@bem-react/classname';

import { useLightboxDispatch, useLightbox } from '../../hooks/useLightbox';
import { ILightboxImage } from '../../react-contexts/lightbox.context';
import { LightboxImageTitle } from './LightboxImageTitle/LightboxImageTitle';

import 'react-image-lightbox/style.css';
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
  src?: string,
): ILightboxProps {
  // closed case
  if (!src) {
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

const reactModalProps = {
  testId: cnLightbox('Portal-Content'),
  htmlOpenClassName: cnLightbox('HTML', { open: true }),
};

export function Lightbox(): ReactElement | null {
  const { images, activeSrc } = useLightbox();
  const contextDispatch = useLightboxDispatch();
  const [prevPathname, setPrevPathName] = useState('');
  const { pathname } = useLocation();

  // catching back/forward (or other) navigations
  if (prevPathname !== pathname) {
    setPrevPathName(pathname);
    contextDispatch({
      type: 'close',
    });
  }

  const lightboxProps = getLightboxPropsByImageSrc(images, activeSrc);

  const onMovePrev = useCallback(() => {
    const { prevSrc } = lightboxProps;

    if (prevSrc) {
      contextDispatch({
        type: 'open',
        imageSrc: prevSrc,
      });
    }
  }, [
    lightboxProps,
    contextDispatch,
  ]);

  const onMoveNext = useCallback(() => {
    const { nextSrc } = lightboxProps;

    if (nextSrc) {
      contextDispatch({
        type: 'open',
        imageSrc: nextSrc,
      });
    }
  }, [
    lightboxProps,
    contextDispatch,
  ]);

  const close = useCallback(() => {
    contextDispatch({
      type: 'close',
    });
  }, [
    contextDispatch,
  ]);

  if (!lightboxProps.mainSrc) {
    return null;
  }

  return (
    <LightboxReact
      { ...lightboxProps }
      enableZoom = { false }
      reactModalProps = { reactModalProps }
      closeLabel = 'Close Image Gallery'
      onMoveNextRequest = { onMoveNext }
      onMovePrevRequest = { onMovePrev }
      onCloseRequest = { close }
    />
  );
}
