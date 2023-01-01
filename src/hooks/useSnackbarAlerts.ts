import { useContext } from 'react';

import {
  ISnackbarAlertsActions,
  SnackbarAlertsActionsContext,
} from '../react-contexts/snackbar-alerts-actions.context';

import {
  ISnackbarAlert,
  SnackbarAlertsContext,
} from '../react-contexts/snackbar-alerts.context';

export function useSnackbarAlerts(): Map<string, ISnackbarAlert> {
  const { alerts } = useContext(SnackbarAlertsContext);

  return alerts;
}

export function useSnackbarAlertsActions(): ISnackbarAlertsActions {
  const { current: actions } = useContext(SnackbarAlertsActionsContext);

  return actions;
}
