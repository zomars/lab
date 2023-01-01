import React, {
  ReactElement,
  useCallback,
  useState,
} from 'react';

import { IconButton } from '@mui/material';

import {
  ThumbUpAlt as ThumbUpIcon,
  ThumbUpAltOutlined as ThumbUpOutlinedIcon,
} from '@mui/icons-material';

import { cn } from '@bem-react/classname';

import { useSkipRenderBeforeRehydration } from '../../../hooks/useSkipRenderBeforeRehydration.hook';
import { useSnackbarAlertsActions } from '../../../hooks/useSnackbarAlerts';
import { EGtmEventTypes, gtmEventEmitter } from '../../../services/gtm-event-emitter';
import { getItem, setItem } from '../../../services/local-storage';

const storageKeyPrefix = 'blog-post-like-state';
const alertKey = 'post-like-button';

interface ILikeButtonProps {
  path: string;
  title: string;
}

type TUseLikeButtonReturn = [
  boolean,
  () => void,
];

// doesn't support background localStorage update
function useLikeButton(
  postId: string,
  postHeader: string,
): TUseLikeButtonReturn {
  const fullStorageKey = `${ storageKeyPrefix }-${ postId }`;

  const skipRender = useSkipRenderBeforeRehydration();
  const alertActions = useSnackbarAlertsActions();

  // we start with disabled button and then flip it to enabled on client (when needed)
  const [liked, setLiked] = useState<boolean>(true);

  if (!skipRender) {
    setLiked(!!getItem(fullStorageKey));
  }

  const onClick = useCallback(() => {
    // flip the value
    const value = !getItem(fullStorageKey);

    setLiked(value);

    // convert it to string
    setItem(fullStorageKey, value ? 'true' : '');

    if (value) {
      alertActions.add({
        key: alertKey,
        text: 'Thank you!',
        autoHide: true,
      });
    }

    gtmEventEmitter(EGtmEventTypes.post_like_button_click, {
      post_header: postHeader,
      post_id: postId,
    });
  }, [
    fullStorageKey,
    alertActions,
    postHeader,
    postId,
  ]);

  return [
    liked,
    onClick,
  ];
}

const cnLikeButton = cn('LikeButton');

export function LikeButton(props: ILikeButtonProps): ReactElement {
  const { path, title } = props;

  const [
    liked,
    onClick,
  ] = useLikeButton(path, title);

  return (
    <IconButton
      color = 'primary'
      title = 'Say Thanks' // not shown on disabled state
      disabled = { liked }
      onClick = { onClick }
      data-testid = { cnLikeButton() }
    >
      { liked ? <ThumbUpIcon/> : <ThumbUpOutlinedIcon/> }
    </IconButton>
  );
}
