import React, {
  ReactElement,
  useCallback,
} from 'react';

import {
  Alert,
  Portal,
  Snackbar,
} from '@mui/material';

import { cn } from '@bem-react/classname';

import { alertNotificationDuration } from '../../constants';
import { useSnackbarAlert, useSnackbarAlertDispatch } from '../../hooks/useSnackbarAlert';

const cnSnackbarAlertsPortal = cn('SnackbarAlertsPortal');

export function SnackbarAlertsPortal(): ReactElement {
  const alerts = useSnackbarAlert();
  const alertDispatch = useSnackbarAlertDispatch();

  const onAlertClose = useCallback((id: string) => {
    alertDispatch({
      type: 'remove',
      alertId: id,
    });
  }, [
    alertDispatch,
  ]);

  const Snacks = Array.from(alerts.values())
    .map(({
      id,
      color,
      text,
      autoHide = false,
    }) => {
      return (
        <Snackbar
          key = { id }
          open = { true }
          onClose = { () => onAlertClose(id) }
          data-testid = { cnSnackbarAlertsPortal('Snackbar') }
          autoHideDuration = { autoHide ? alertNotificationDuration : undefined }
        >
          <Alert
            color = { color || 'success' }
          >
            { text }
          </Alert>
        </Snackbar>
      );
    });

  return (
    <Portal>
      { Snacks }
    </Portal>
  );
}
