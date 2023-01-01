import React from 'react';

import { ISnackbarAlert } from './snackbar-alerts.context';

export interface ISnackbarAlertsActions {
  add(alert: ISnackbarAlert): void;
  remove(alertKey: string): void;
}

export const snackbarAlertsActionsDefault = {
  /* eslint-disable @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars */
  add(alert: ISnackbarAlert) {},
  remove(alertKey: string) {},
  /* eslint-enable @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars */
};

export const SnackbarAlertsActionsContext = React.createContext({
  current: snackbarAlertsActionsDefault,
});

SnackbarAlertsActionsContext.displayName = 'SnackbarAlertsActionsContext';
