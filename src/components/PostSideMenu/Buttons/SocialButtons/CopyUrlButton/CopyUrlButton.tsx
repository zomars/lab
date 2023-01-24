import React, { ReactElement, useCallback } from 'react';
import { Link as LinkIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';

import { cn } from '@bem-react/classname';
import { classnames } from '@bem-react/classnames';
import { useSnackbarAlertDispatch } from '../../../../../hooks/useSnackbarAlert';
import { copyTextToBuffer } from '../../../../../services/copy-to-buffer';

import './CopyUrlButton.scss';

interface ICopyUrlButtonProps {
  className?: string;
  onClick: () => void;
  'data-testid'?: string;
}

const cnCopyUrlButton = cn('CopyUrlButton');

const snackbarAlertId = 'copy-url-button-click';

export function CopyUrlButton(props: ICopyUrlButtonProps): ReactElement {
  const {
    className,
    onClick: onClickProp,
    'data-testid': dataTestId,
  } = props;

  const snackbarAlertDispatch = useSnackbarAlertDispatch();

  const onClick = useCallback(() => {
    const { href: url } = window.location;

    // todo handle async operation properly
    copyTextToBuffer(url);

    snackbarAlertDispatch({
      type: 'add',
      alert: {
        id: snackbarAlertId,
        text: 'Link copied',
        autoHide: true,
      },
    });

    onClickProp();// GTM logging
  }, [
    onClickProp,
    snackbarAlertDispatch,
  ]);

  return (
    <IconButton
      size = 'small'
      className = {
        classnames(className, cnCopyUrlButton())
      }
      onClick = { onClick }
      title = 'Copy Link'
      data-testid = { dataTestId || null }
    >
      <LinkIcon
        color = 'inherit'
        fontSize = 'small'
      />
    </IconButton>
  );
}
