import React, { ReactElement } from 'react';
import {
  GatsbyImage,
  getImage,
  IGatsbyImageData,
} from 'gatsby-plugin-image';

export interface IGridImage {
  title?: string;
  caption?: string;
  image: {
    publicUrl: string;
    childImageSharp: {
      full: IGatsbyImageData;
    };
  };
}

interface IImageGridProps {
  imageGroups: Array<IGridImage>[];
}

import { cn } from '@bem-react/classname';
import { classnames } from '@bem-react/classnames';

import './ImageGrid.scss';

const cnImageGrid = cn('ImageGrid');

function ImageGroup(
  groupImages: IGridImage[],
  groupIndex: number,
): ReactElement[] {
  let groupSizeClassName = '';

  switch (groupImages.length) {
    case 1:
      groupSizeClassName = cnImageGrid('Cell', { size: 'large' });
      break;

    case 2:
      groupSizeClassName = cnImageGrid('Cell', { size: 'medium' });
  }

  return groupImages.map(
    ({
      image,
      title,
    }, index) => {
      return (
        <div
          key = { `${ groupIndex }-${ index }` }
          className = { classnames(cnImageGrid('Cell'), groupSizeClassName) }
        >
          <a
            href = { image.publicUrl }
            target = 'blank'
            rel = 'noopener'
          >
            <GatsbyImage
              className = { cnImageGrid('Thumb') }
              image = { getImage(image.childImageSharp.full) as IGatsbyImageData }
              alt = { title || '' }
            />
          </a>
          <div className = { cnImageGrid('Title') }>
            { title }
          </div>
        </div>
      );
    });
}

export function ImageGrid(props: IImageGridProps): ReactElement {
  const { imageGroups } = props;

  return (
    <div className = { cnImageGrid() } >
      { imageGroups.map(ImageGroup) }
    </div>
  );
}
