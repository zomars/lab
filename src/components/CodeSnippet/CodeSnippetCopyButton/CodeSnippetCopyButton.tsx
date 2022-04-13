import {
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import React, { ReactElement, useState } from 'react';
import { cn } from '@bem-react/classname';
import { classnames } from '@bem-react/classnames';

import { copyTextToBuffer } from '../../../services/copy-to-buffer';

const codeSnippetCopyButton = cn('CodeSnippetCopyButton');

const notificationDuration = 1000; // ms

interface ICodeSnippetCopyButtonProps {
  className?: string;
  codeText: string;
}

export function CodeSnippetCopyButton(props: ICodeSnippetCopyButtonProps): ReactElement {
  const { className, codeText } = props;

  const [copyInProgress, setCopyInProgress] = useState(false);
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [snackBarClosureTimeoutId, setSnackBarClosureTimeoutId] = useState(NaN);

  function copyTextEventHandler(): void {
    setCopyInProgress(true);
    setShowSnackBar(true);

    if (snackBarClosureTimeoutId) {
      clearTimeout(snackBarClosureTimeoutId);
    }

    copyTextToBuffer(codeText)
      .then(() => {
        setCopyInProgress(false);

        const timeoutId = setTimeout(() => setShowSnackBar(false), notificationDuration);

        setSnackBarClosureTimeoutId(timeoutId as unknown as number);
      });
  }

  return (
    <>
      <Button
        className = { classnames(codeSnippetCopyButton(), className) }
        disabled = { copyInProgress }
        onClick = { copyTextEventHandler }
        variant = 'contained'
        size = 'small'
      >
        Copy
      </Button>

      <Snackbar
        key = 'code-snippet-copied'
        open = { showSnackBar }
      >
        <Alert color = 'info'>
          Code snippet copied
        </Alert>
      </Snackbar>
    </>
  );
}
