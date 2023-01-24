import React from 'react';
import { AlertProps } from '@mui/material';

export interface ISnackbarAlert {
  id: string;
  color?: AlertProps['color'];
  text: string;
  autoHide?: boolean;
}

interface IAddSnackbarAlertAction {
  type: 'add';
  alert: ISnackbarAlert;
}

interface IRemoveSnackbarAlertAction {
  type: 'remove';
  alertId: string;
}

export type TSnackbarAlertAction = IAddSnackbarAlertAction | IRemoveSnackbarAlertAction;

type TSnackbarAlertContext = Map<string, ISnackbarAlert>;

export const SnackbarAlertsContext = React.createContext(new Map<string, ISnackbarAlert>());

SnackbarAlertsContext.displayName = 'SnackbarAlertsContext';

export const SnackbarAlertsDispatch =
  React.createContext<(action: TSnackbarAlertAction) => void>(() => undefined);

SnackbarAlertsDispatch.displayName = 'SnackbarAlertsDispatch';

export function snackbarAlertReducer(
  context: TSnackbarAlertContext,
  action: TSnackbarAlertAction,
): TSnackbarAlertContext {
  switch (action.type) {
    case 'add': {
      const { alert } = action;

      if (context.has(alert.id)) {
        throw Error('Can\'t add a duplicate alert');
      }

      context.set(alert.id, alert);

      return new Map(context);
    }

    case 'remove': {
      const { alertId } = action;

      if (!context.has(alertId)) {
        throw Error('Can\'t remove alert - not found');
      }

      context.delete(alertId);

      return new Map(context);
    }
  }
}
