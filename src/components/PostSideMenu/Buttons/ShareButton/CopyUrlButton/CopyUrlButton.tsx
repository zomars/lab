import React, { ReactElement, useCallback } from 'react';
import { Link as LinkIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';

import { cn } from '@bem-react/classname';
import { classnames } from '@bem-react/classnames';

import { useSnackbarAlertsActions } from '../../../../../hooks/useSnackbarAlerts';
import { copyTextToBuffer } from '../../../../../services/copy-to-buffer';

import './CopyUrlButton.scss';

interface ICopyUrlButtonProps {
  className?: string;
  onClick: () => void;
}

const cnCopyUrlButton = cn('CopyUrlButton');

const snackbarAlertKey = 'copy-url-button-click';

export function CopyUrlButton(props: ICopyUrlButtonProps): ReactElement {
  const {
    className,
    onClick: onClickProp,
  } = props;

  const alertActions = useSnackbarAlertsActions();

  const onClick = useCallback(async () => {
    const { href: url } = window.location;

    await copyTextToBuffer(url);

    alertActions.add({
      key: snackbarAlertKey,
      text: 'Link copied',
      autoHide: true,
    });

    onClickProp();// GTM logging
  }, [
    onClickProp,
    alertActions,
  ]);

  return (
    <IconButton
      size = 'small'
      className = {
        classnames(className, cnCopyUrlButton())
      }
      onClick = { onClick }
      title = 'Copy Link'
    >
      <LinkIcon
        color = 'inherit'
        fontSize = 'small'
      />
    </IconButton>
  );
}
