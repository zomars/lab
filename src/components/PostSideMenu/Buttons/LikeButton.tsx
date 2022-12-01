import React, {
  ReactElement,
  useCallback,
  useState,
} from 'react';

import {
  Alert,
  IconButton,
  Portal,
  Snackbar,
} from '@mui/material';

import {
  ThumbUpAlt as ThumbUpIcon,
  ThumbUpAltOutlined as ThumbUpOutlinedIcon,
} from '@mui/icons-material';

import { alertNotificationDuration } from '../../../constants';
import { useSkipRenderBeforeRehydration } from '../../../hooks/useSkipRenderBeforeRehydration.hook';
import { EGtmEventTypes, gtmEventEmitter } from '../../../services/gtm-event-emitter';
import { getItem, setItem } from '../../../services/local-storage';

const storageKeyPrefix = 'blog-post-like-state';

interface ILikeButtonProps {
  path: string;
  title: string;
}

type TUseLikeButtonReturn = [
  boolean,
  () => void,
  boolean,
  () => void,
];

// doesn't support background localStorage update
function useLikeButton(
  postId: string,
  postHeader: string,
): TUseLikeButtonReturn {
  const fullStorageKey = `${ storageKeyPrefix }-${ postId }`;

  const [showAlert, setShowAlert] = useState(false);
  const skipRender = useSkipRenderBeforeRehydration();

  const onAlertClose = useCallback(() => {
    setShowAlert(false);
  }, []);

  // we start with disabled button and then flip it to enabled on client (when needed)
  const [liked, setLiked] = useState<boolean>(true);

  if (!skipRender) {
    setLiked(!!getItem(fullStorageKey));
  }

  const onClick = useCallback(() => {
    // flip the value
    const value = !getItem(fullStorageKey);

    if (value) {
      setShowAlert(true);
    }

    setLiked(value);

    gtmEventEmitter(EGtmEventTypes.post_like_button_click, {
      post_header: postHeader,
      post_id: postId,
    });

    // convert it to string
    setItem(fullStorageKey, value ? 'true' : '');

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    fullStorageKey,
  ]);

  return [
    liked,
    onClick,
    showAlert,
    onAlertClose,
  ];
}

export function LikeButton(props: ILikeButtonProps): ReactElement {
  const { path, title } = props;

  const [
    liked,
    onClick,
    showAlert,
    onAlertClose,
  ] = useLikeButton(path, title);

  return (
    <>
      <IconButton
        color = 'primary'
        title = 'Say Thanks' // not shown on disabled state
        disabled = { liked }
        onClick = { onClick }
      >
        { liked ? <ThumbUpIcon/> : <ThumbUpOutlinedIcon/> }
      </IconButton>

      <Portal>
        <Snackbar
          key = 'post-like-button'
          open = { showAlert }
          onClose = { onAlertClose }
          autoHideDuration = { alertNotificationDuration }
        >
          <Alert
            color = 'success'
          >
            Thank you!
          </Alert>
        </Snackbar>
      </Portal>
    </>
  );
}
