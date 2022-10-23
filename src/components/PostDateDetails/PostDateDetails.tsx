import React, { ReactElement } from 'react';
import { dateFormat, formatDate } from '../../services/format-date';

interface IPostDateDetails {
  publishedDate: string;
  updatedDate?: string;
  short?: boolean;
}

export function PostDateDetails(props: IPostDateDetails): ReactElement {
  const { publishedDate, updatedDate, short } = props;

  return (
    <>
      { short ? null : 'Published on ' }
      <time
        dateTime = { formatDate(publishedDate, dateFormat.short) }
      >
        { formatDate(publishedDate) }
      </time>
      .
      { updatedDate ?
        <>{ ' Last updated on ' }
          <time
            dateTime = { formatDate(updatedDate, dateFormat.short) }
          >
            { formatDate(updatedDate) }
          </time>.
        </> : null }
    </>
  );
}
