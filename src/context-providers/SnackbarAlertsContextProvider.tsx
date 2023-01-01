import React, {
  ReactElement,
  useRef,
  useState,
  useMemo,
} from 'react';

import {
  ISnackbarAlert,
  SnackbarAlertsContext,
} from '../react-contexts/snackbar-alerts.context';

import {
  SnackbarAlertsActionsContext,
} from '../react-contexts/snackbar-alerts-actions.context';

export function SnackbarAlertsContextProvider(
  { children }: { children: ReactElement },
): ReactElement {
  const [context, setContext] = useState({
    alerts: new Map(),
  });

  // I'm guessing this works because alerts map is never being redefined
  // and because we are using setContext with the callback argument
  // otherwise we would need to keep updating actionsContextRef.current
  const actions = useMemo(() => ({
    add(alert: ISnackbarAlert) {
      context.alerts.set(alert.key, alert);

      setContext(context => ({ ...context }));
    },
    remove(alertKey: string) {
      context.alerts.delete(alertKey);

      setContext(context => ({ ...context }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), []);

  const actionsContextRef = useRef(actions);

  return (
    <SnackbarAlertsActionsContext.Provider
      value = { actionsContextRef }
    >
      <SnackbarAlertsContext.Provider
        value = { context }
      >
        { children }
      </SnackbarAlertsContext.Provider>
    </SnackbarAlertsActionsContext.Provider>
  );
}
