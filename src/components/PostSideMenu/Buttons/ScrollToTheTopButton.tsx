import React, {
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { GetApp as ArrowUpwardIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';

import { throttle } from 'lodash';
import { cn } from '@bem-react/classname';
import { usePost } from '../../../hooks/usePost';

import { EGtmEventTypes, gtmEventEmitter } from '../../../services/gtm-event-emitter';

const cnScrollToTheTopButton = cn('ScrollToTheTopButton');

function useDisabledScrollButton(): boolean {
  const [disabled, setDisabled] = useState<boolean>(true);

  useEffect(() => {
    if (!window) {
      return;
    }

    function scrollEventHandler(): void {
      // 100 is kinda arbitrary number
      setDisabled(window.scrollY <= 100);
    }

    const throttledScrollEventHandler = throttle(scrollEventHandler, 99);

    window.addEventListener('scroll', throttledScrollEventHandler);

    scrollEventHandler();

    return () => {
      throttledScrollEventHandler.cancel();
      window.removeEventListener('scroll', throttledScrollEventHandler);
    };
  }, []);

  return disabled;
}

export function ScrollToTheTopButton(): ReactElement {
  const disabled = useDisabledScrollButton();
  const post = usePost();

  const onClick = useCallback(() => {
    if (!post) {
      return;
    }

    const { path, title } = post;

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    gtmEventEmitter(EGtmEventTypes.post_scroll_to_top_click, {
      post_id: path,
      post_header: title,
    });
  }, [
    post,
  ]);

  return (
    <IconButton
      color = 'primary'
      title = 'Scroll to the Top'
      disabled = { disabled }
      onClick = { onClick }
      data-testid = { cnScrollToTheTopButton() }
    >
      <ArrowUpwardIcon
        sx = {{
          transform: 'rotate(180deg)',
        }}
      />
    </IconButton>
  );
}
