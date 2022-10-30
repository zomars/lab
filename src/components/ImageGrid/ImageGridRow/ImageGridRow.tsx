import React, {
  ReactElement,
  useContext,
  useEffect,
} from 'react';

import { cn } from '@bem-react/classname';
import {
  GatsbyImage,
  getImage,
  IGatsbyImageData,
} from 'gatsby-plugin-image';

import { lightboxActionsContext } from '../../../react-contexts/lightbox-actions.context';
import { IGridImage } from '../ImageGrid';

import './ImageGridRow.scss';

interface IImageGridRow {
  images: IGridImage[];
}

const cnImageGridRow = cn('ImageGridRow');

export function ImageGridRow(props: IImageGridRow): ReactElement {
  const { images } = props;

  const { current: context } = useContext(lightboxActionsContext);

  // Add and remove images to context in runtime
  // props.images update is not supported
  useEffect(() => {
    images.forEach(({ image: { publicUrl }, title }) => {
      context.addImage({
        src: publicUrl,
        title,
      });
    });

    return () => {
      images.forEach(({ image: { publicUrl } }) => {
        context.removeImage(publicUrl);
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
            return (
              <div
                key = { `${ index }` }
                data-testid = { cnImageGridRow('Cell') }
                className = { cnImageGridRow('Cell', sizeModifiers) }
                onClick = { () => context.openAt(image.publicUrl) }
              >
                <GatsbyImage
                  className = { cnImageGridRow('Cell-Thumb') }
                  image = { getImage(image.childImageSharp.preview) as IGatsbyImageData }
                  alt = { title || '' }
                />
                <div className = { cnImageGridRow('Cell-Title') }>
                  { title }
                </div>
              </div>
            );
          })
      }
    </>
  );
}
