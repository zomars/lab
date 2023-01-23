import {
  GatsbyImage,
  getImage,
  getSrc,
  IGatsbyImageData,
} from 'gatsby-plugin-image';

import React, {
  ReactElement,
  useEffect,
  useState,
} from 'react';

import { cn } from '@bem-react/classname';

import { useLightboxDispatch } from '../../../hooks/useLightbox';
import { EGtmEventTypes, gtmEventEmitter } from '../../../services/gtm-event-emitter';
import { IGridImage } from '../ImageGrid';

import './ImageGridRow.scss';

interface IImageGridRow {
  images: IGridImage[];
}

const cnImageGridRow = cn('ImageGridRow');

export function ImageGridRow(props: IImageGridRow): ReactElement {
  const { images } = props;
  const dispatchContext = useLightboxDispatch();
  const [firstRender, setFirstRender] = useState(true);

  if (firstRender) {
    setFirstRender(false);

    images.forEach(({ image, title }) => {
      const src = getSrc(image.childImageSharp.preview) as string;

      dispatchContext({
        type: 'add',
        image: {
          src,
          title,
        },
      });
    });
  }

  // Add and remove images to context in runtime
  // props.images update is not supported
  useEffect(() => {
    return () => {
      images.forEach(({ image }) => {
        const src = getSrc(image.childImageSharp.preview) as string;

        dispatchContext({
          type: 'remove',
          imageSrc: src,
        });
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sizeModifiers: { size?: string } = {};

  switch (images.length) {
    case 1:
      sizeModifiers.size = 'large';
      break;

    case 2:
      sizeModifiers.size = 'medium';
      break;
  }

  return (
    <>
      {
        images.map(
          ({
            image,
            title,
          }, index) => {
            const src = getSrc(image.childImageSharp.preview) as string;

            function onImageClick(): void {
              dispatchContext({
                type: 'open',
                imageSrc: src,
              });

              gtmEventEmitter(EGtmEventTypes.image_grid_lightbox_open, {
                lightbox_image_src: src,
              });
            }

            return (
              <div
                key = { `${ index }` }
                data-testid = { cnImageGridRow('Cell') }
                className = { cnImageGridRow('Cell', sizeModifiers) }
                onClick = { () => onImageClick() }
              >
                <GatsbyImage
                  className = { cnImageGridRow('Cell-Thumb') }
                  image = { getImage(image.childImageSharp.preview) as IGatsbyImageData }
                  alt = { title || '' }
                />
                { title ?
                  <div
                    className = { cnImageGridRow('Cell-Title') }
                    data-testid = { cnImageGridRow('Cell-Title') }
                  >
                    { title }
                  </div> : null }
              </div>
            );
          })
      }
    </>
  );
}
