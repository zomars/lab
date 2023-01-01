import React, { ReactElement } from 'react';
import {
  Alert,
  Portal,
  Snackbar,
} from '@mui/material';

import { cn } from '@bem-react/classname';

import { alertNotificationDuration } from '../../constants';
import { useSnackbarAlertsActions, useSnackbarAlerts } from '../../hooks/useSnackbarAlerts';

const cnSnackbarAlertsPortal = cn('SnackbarAlertsPortal');

export function SnackbarAlertsPortal(): ReactElement {
  const alerts = useSnackbarAlerts();
  const alertActions = useSnackbarAlertsActions();

  function onAlertClose(key: string): void {
    alertActions.remove(key);
  }

  const Snacks = Array.from(alerts.values())
    .map(({
      key,
      color,
      text,
      autoHide = false,
    }) => {
      return (
        <Snackbar
          key = { key }
          open = { true }
          onClose = { () => onAlertClose(key) }
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
