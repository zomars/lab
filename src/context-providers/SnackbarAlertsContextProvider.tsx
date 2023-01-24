import React, {
  ReactElement,
  useReducer,
} from 'react';

import {
  snackbarAlertReducer,
  SnackbarAlertsContext,
  SnackbarAlertsDispatch,
} from '../react-contexts/snackbar-alerts.context';

export function SnackbarAlertsContextProvider(
  { children }: { children: ReactElement },
): ReactElement {
  const [context, dispatch] = useReducer(snackbarAlertReducer, new Map());

  return (
    <SnackbarAlertsContext.Provider
      value = { context }
    >
      <SnackbarAlertsDispatch.Provider
        value = { dispatch }
      >
        { children }
      </SnackbarAlertsDispatch.Provider>
    </SnackbarAlertsContext.Provider>
  );
}
