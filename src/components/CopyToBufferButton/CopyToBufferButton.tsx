import {
  Button,
  ButtonProps,
} from '@mui/material';

import React, {
  ReactElement,
  useCallback,
  useState,
} from 'react';

import { cn } from '@bem-react/classname';
import { classnames } from '@bem-react/classnames';
import { useSnackbarAlertDispatch } from '../../hooks/useSnackbarAlert';

import { copyTextToBuffer } from '../../services/copy-to-buffer';
import { gtmEventEmitter, EGtmEventTypes } from '../../services/gtm-event-emitter';

const copyToBufferButton = cn('CopyToBufferButton');

const gtmEventTextLimit = 256;

const alertId = 'code-snippet-copied';

interface ICopyToBufferButton {
  className?: string;
  textToCopy: string;
  alertMessage?: string;
  size?: ButtonProps['size'];
  children?: string; // button label
  disabled?: boolean;
  fullWidth?: boolean;
}

const enum CopyingState {
  'INITIAL' = 'INITIAL',
  'IN_PROGRESS' = 'IN_PROGRESS',
  'FAILURE' = 'FAILURE',
  'SUCCESS' = 'SUCCESS',
}

interface IBufferCopyingStatus {
  state: CopyingState;
  errorMessage?: string;
}

export function CopyToBufferButton(props: ICopyToBufferButton): ReactElement {
  const {
    className,
    textToCopy,
    children: btnLabel,
    size,
    disabled,
    fullWidth,
    alertMessage: alertMessageProp,
  } = props;

  const [copyingState, setCopyingStatus] = useState<IBufferCopyingStatus>({
    state: CopyingState.INITIAL,
  });

  const snackbarAlertDispatch = useSnackbarAlertDispatch();

  const show = useCallback((): void => {
    setCopyingStatus({
      state: CopyingState.IN_PROGRESS,
    });

    copyTextToBuffer(textToCopy)
      .then(() => {
        setCopyingStatus({
          state: CopyingState.SUCCESS,
        });

        snackbarAlertDispatch({
          type: 'add',
          alert: {
            id: alertId,
            text: alertMessageProp || 'Copied',
            autoHide: true,
          },
        });

        gtmEventEmitter(EGtmEventTypes.code_snippet_copy, {
          code_snippet_copy_text: textToCopy.substring(0, gtmEventTextLimit),
        });
      })
      .catch((error: string) => {
        setCopyingStatus({
          state: CopyingState.FAILURE,
          errorMessage: error,
        });

        snackbarAlertDispatch({
          type: 'add',
          alert: {
            id: alertId,
            color: 'error',
            text: error || 'Couldn\'t copy',
            autoHide: true,
          },
        });
      });
  }, [
    snackbarAlertDispatch,
    alertMessageProp,
    textToCopy,
  ]);

  const { state } = copyingState;

  const btnIsDisabled = disabled || state === CopyingState.IN_PROGRESS;

  return (
    <Button
      variant = 'contained'
      onClick = { () => show() }
      className = { classnames(copyToBufferButton(), className) }
      data-testid = { copyToBufferButton() }
      disabled = { btnIsDisabled }
      size = { size || undefined }
      fullWidth = { fullWidth || false }
    >
      { btnLabel || 'Copy' }
    </Button>
  );
}
