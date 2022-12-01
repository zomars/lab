import {
  Button,
  Snackbar,
  Alert,
  AlertProps,
  ButtonProps,
  Portal,
} from '@mui/material';

import React, {
  ReactElement,
  useEffect,
  useState,
} from 'react';

import { cn } from '@bem-react/classname';
import { classnames } from '@bem-react/classnames';
import { alertNotificationDuration } from '../../constants';

import { copyTextToBuffer } from '../../services/copy-to-buffer';
import { gtmEventEmitter, EGtmEventTypes } from '../../services/gtm-event-emitter';

const copyToBufferButton = cn('CopyToBufferButton');

const gtmEventTextLimit = 256;

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

interface IUseCopyingAlertHook {
  isVisible: boolean;
  color: AlertProps['color'];
  message: string;
}

function useCopyingAlert(
  copyingState: IBufferCopyingStatus,
  successMessage = '',
): IUseCopyingAlertHook {
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const { state } = copyingState;

    let timeoutId: ReturnType<typeof setTimeout>;

    if (state === CopyingState.SUCCESS || state === CopyingState.FAILURE) {
      setShowAlert(true);

      timeoutId = setTimeout(
        () => setShowAlert(false),
        alertNotificationDuration,
      );
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [copyingState]);

  const { state, errorMessage = '' } = copyingState;

  const color = state === CopyingState.FAILURE ? 'error' : 'success';
  const message = state === CopyingState.FAILURE ?
    errorMessage : successMessage || 'Copied';

  return {
    isVisible: showAlert,
    color,
    message,
  };
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

  function show(): void {
    setCopyingStatus({
      state: CopyingState.IN_PROGRESS,
    });

    copyTextToBuffer(textToCopy)
      .then(() => {
        gtmEventEmitter(EGtmEventTypes.code_snippet_copy, {
          code_snippet_copy_text: textToCopy.substring(0, gtmEventTextLimit),
        });

        setCopyingStatus({
          state: CopyingState.SUCCESS,
        });
      })
      .catch((error: string) => {
        setCopyingStatus({
          state: CopyingState.FAILURE,
          errorMessage: error,
        });
      });
  }

  const {
    color: alertColor,
    message: alertMessage,
    isVisible: alertIsVisible,
  } = useCopyingAlert(copyingState, alertMessageProp);

  const { state } = copyingState;

  const btnIsDisabled = disabled || state === CopyingState.IN_PROGRESS;

  return (
    <>
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

      <Portal>
        <Snackbar
          key = 'code-snippet-copied'
          open = { alertIsVisible }
        >
          <Alert
            color = { alertColor }
          >
            { alertMessage }
          </Alert>
        </Snackbar>
      </Portal>
    </>
  );
}
