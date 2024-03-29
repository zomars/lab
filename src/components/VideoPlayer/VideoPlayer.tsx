import React, { ReactElement } from 'react';
import { cn } from '@bem-react/classname';

import './VideoPlayer.scss';

interface IVideoPlayerProps {
  src: string;
  title?: string;
}

const allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen';
const width = 800;
const cnVideoPlayer = cn('VideoPlayer');

export function VideoPlayer(props: IVideoPlayerProps): ReactElement {
  const {
    title,
    src,
  } = props;

  // need to add ?enablejsapi=1 to turn GA tracking

  return (
    <div className = { cnVideoPlayer() }>
      <iframe
        className = { cnVideoPlayer('iframe') }
        src = { src }
        width = { width }
        height = { Math.ceil(width / 1.77) }
        title = { title }
        allow = { allow }
      />
    </div>
  );
}
