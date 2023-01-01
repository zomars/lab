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

import { EGtmEventTypes, gtmEventEmitter } from '../../../services/gtm-event-emitter';

function useDisabledButton(): boolean {
  const [disabled, setDisabled] = useState<boolean>(true);

  useEffect(() => {
    if (!window) {
      return;
    }

    const scrollEventHandler = throttle(() => {
      // 100 is kinda arbitrary number
      setDisabled(window.scrollY <= 100);
    }, 99);

    window.addEventListener('scroll', scrollEventHandler);

    return () => {
      scrollEventHandler.cancel();
      window.removeEventListener('scroll', scrollEventHandler);
    };
  }, []);

  return disabled;
}

interface IScrollToTheTopButtonProps {
  path: string;
  title: string;
}

const cnScrollToTheTopButton = cn('ScrollToTheTopButton');

export function ScrollToTheTopButton(props: IScrollToTheTopButtonProps): ReactElement {
  const disabled = useDisabledButton();
  const { path, title } = props;

  const onClick = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    gtmEventEmitter(EGtmEventTypes.post_scroll_to_top_click, {
      post_id: path,
      post_header: title,
    });
  }, [
    path,
    title,
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
