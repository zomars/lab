import React, {
  ReactElement,
  useCallback,
  useState,
} from 'react';

import {
  IconButton,
} from '@mui/material';

import {
  Message as MessageIcon,
} from '@mui/icons-material';

import { usePost } from '../../../../hooks/usePost';
import { EGtmEventTypes, gtmEventEmitter } from '../../../../services/gtm-event-emitter';
import { SendMessageDialog } from '../../../SendMessageDialog/SendMessageDialog';

export function MessageButton(): ReactElement {
  const [isOpen, toggleDialog] = useState(false);
  const post = usePost();

  const isTechPost = (post?.tags || []).indexOf('tech') !== -1;
  const postTag = isTechPost ? 'tech' : 'cars';

  const openDialog = useCallback(() => {
    toggleDialog(true);

    if (!post) {
      return;
    }

    const { title, path } = post;

    gtmEventEmitter(EGtmEventTypes.post_send_message_open, {
      post_id: path,
      post_header: title,
    });
  }, [
    toggleDialog,
    post,
  ]);

  return (
    <>
      <IconButton
        color = 'primary'
        title = 'Feedback or question'
        onClick = { openDialog }
      >
        <MessageIcon
          fontSize = 'inherit'
        />
      </IconButton>

      {
        isOpen ?
          <SendMessageDialog
            onClose = { () => toggleDialog(false) }
            postTag = { postTag }
          /> : null
      }
    </>
  );
}
