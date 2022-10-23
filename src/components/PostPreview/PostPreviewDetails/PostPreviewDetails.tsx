import CollectionsOutlinedIcon from '@mui/icons-material/CollectionsOutlined';
import React, { ReactElement } from 'react';
import { cn } from '@bem-react/classname';

import './PostPreviewDetails.scss';
import { PostDateDetails } from '../../PostDateDetails/PostDateDetails';

interface IPostPreviewDetails {
  published: string;
  updated?: string;
  readingTime: string;
  gridImages: number;
}

const cnPostPreviewDetails = cn('PostPreviewDetails');

export function PostPreviewDetails(props: IPostPreviewDetails): ReactElement {
  const {
    published,
    updated,
    readingTime,
    gridImages,
  } = props;

  return (
    <>
      <PostDateDetails
        publishedDate = { published }
        updatedDate = { updated }
        short
      />
      { ' ' }
      { readingTime }.
      {
        gridImages ?
          <>
            <CollectionsOutlinedIcon
              className = { cnPostPreviewDetails('Icon') }
              fontSize = 'inherit'
            />
            { gridImages }
          </> : null
      }
    </>
  );
}
