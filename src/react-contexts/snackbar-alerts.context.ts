import React from 'react';
import { AlertProps } from '@mui/material';

export interface ISnackbarAlert {
  key: string;
  color?: AlertProps['color'];
  text: string;
  autoHide?: boolean;
}

export const snackbarAlertsDefault = {
  alerts: new Map<string, ISnackbarAlert>(),
};

export const SnackbarAlertsContext = React.createContext(snackbarAlertsDefault);

SnackbarAlertsContext.displayName = 'SnackbarAlertsContext';
