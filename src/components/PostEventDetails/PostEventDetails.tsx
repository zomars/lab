import React, { ReactElement } from 'react';
import { dateFormat, formatDate } from '../../services/format-date';
import { IPostEventDetails } from '../../types/common.types';

function getMapsQueryUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${ decodeURIComponent(query) }`;
}

export function PostEventDetails(props: IPostEventDetails): ReactElement {
  const {
    date,
    locationAddress,
    locationName,
  } = props;

  const label = locationName || locationAddress;
  const query = locationAddress || locationName;

  return (
    <>
      {' '} Event was held at {' '}
      <a
        target = 'blank'
        rel = 'noopener'
        href = { getMapsQueryUrl(query) }
      >
        { label }
      </a> on { ' ' }
      <time
        dateTime = { formatDate(date, dateFormat.short) }
      >
        { formatDate(date) }
      </time>.
    </>
  );
}
