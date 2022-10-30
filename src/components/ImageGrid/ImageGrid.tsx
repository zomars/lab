import { cn } from '@bem-react/classname';

import { IGatsbyImageData } from 'gatsby-plugin-image';
import React, { ReactElement } from 'react';

import { ImageGridRow } from './ImageGridRow/ImageGridRow';

import './ImageGrid.scss';

export interface IGridImage {
  title?: string;
  caption?: string;
  image: {
    publicUrl: string;
    childImageSharp: {
      preview: IGatsbyImageData;
      full: IGatsbyImageData;
    };
  };
}

interface IImageGridProps {
  imageGroups: Array<IGridImage>[];
}

const cnImageGrid = cn('ImageGrid');

export function ImageGrid(props: IImageGridProps): ReactElement {
  const { imageGroups } = props;

  return (
    <div
      data-testid = { cnImageGrid() }
      className = { cnImageGrid() }
    >
      {
        imageGroups.map(
          (rowImages, rowIndex) => (
            <ImageGridRow
              key = { rowIndex }
              images = { rowImages }
            />)
        )
      }
    </div>
  );
}
