import React, {
  ReactElement,
  useCallback,
} from 'react';

import { IconButton } from '@mui/material';

import {
  ThumbUpAlt as ThumbUpIcon,
  ThumbUpAltOutlined as ThumbUpOutlinedIcon,
} from '@mui/icons-material';

import { cn } from '@bem-react/classname';
import { usePost, usePostDispatch } from '../../../hooks/usePost';

import { useLocalStoragePostLike } from '../../../hooks/useLocalStoragePostLike.hook';
import { useSnackbarAlertDispatch } from '../../../hooks/useSnackbarAlert';
import { EGtmEventTypes, gtmEventEmitter } from '../../../services/gtm-event-emitter';
import { useSkipRenderBeforeRehydration } from '../../../hooks/useSkipRenderBeforeRehydration.hook';

const alertId = 'post-like-button';

type TUseLikeButtonReturn = [
  boolean,
  () => void,
];

// doesn't support background localStorage update
function useLikeButton(): TUseLikeButtonReturn {
  const post = usePost();
  const postContextDispatch = usePostDispatch();
  const [, setPostLikeFromStorage] = useLocalStoragePostLike(post?.path || '');
  const snackbarAlertDispatch = useSnackbarAlertDispatch();

  const liked = post?.liked || false;

  const onClick = useCallback(() => {
    // button is disabled when not available
    if (!post) {
      return;
    }

    const newValue = !liked;

    postContextDispatch({
      type: 'like',
      value: newValue,
    });

    setPostLikeFromStorage(newValue);

    if (newValue) {
      snackbarAlertDispatch({
        type: 'add',
        alert: {
          id: alertId,
          text: 'Thank you!',
          autoHide: true,
        },
      });
    }

    gtmEventEmitter(EGtmEventTypes.post_like_button_click, {
      post_header: post.title,
      post_id: post.path,
    });
  }, [
    post,
    liked,
    setPostLikeFromStorage,
    postContextDispatch,
    snackbarAlertDispatch,
  ]);

  return [
    liked,
    onClick,
  ];
}

const cnLikeButton = cn('LikeButton');

export function LikeButton(): ReactElement {
  const isSsr = useSkipRenderBeforeRehydration();
  const post = usePost();

  const [
    isLiked,
    onClick,
  ] = useLikeButton();

  return (
    <IconButton
      color = 'primary'
      title = 'Say Thanks' // not shown on disabled state
      disabled = { isSsr || !post || post.liked }
      onClick = { onClick }
      data-testid = { cnLikeButton() }
    >
      { isLiked ? <ThumbUpIcon/> : <ThumbUpOutlinedIcon/> }
    </IconButton>
  );
}
