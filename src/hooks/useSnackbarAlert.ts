import { useContext } from 'react';

import {
  ISnackbarAlert,
  SnackbarAlertsContext,
  SnackbarAlertsDispatch,
  TSnackbarAlertAction,
} from '../react-contexts/snackbar-alerts.context';

export function useSnackbarAlert(): Map<string, ISnackbarAlert> {
  return useContext(SnackbarAlertsContext);
}

export function useSnackbarAlertDispatch(): (action: TSnackbarAlertAction) => void {
  return useContext(SnackbarAlertsDispatch);
}
