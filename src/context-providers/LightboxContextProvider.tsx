import React, {
  ReactElement,
  useReducer,
} from 'react';

import {
  LightboxContext,
  lightboxContextReducer,
  LightboxDispatchContext,
} from '../react-contexts/lightbox.context';

export function LightboxContextProvider(
  { children }: { children: ReactElement },
): ReactElement {
  const [context, dispatch] = useReducer(lightboxContextReducer, {
    images: new Map(),
    activeSrc: '',
  });

  return (
    <LightboxContext.Provider
      value = { context }
    >
      <LightboxDispatchContext.Provider
        value = { dispatch }
      >
        { children }
      </LightboxDispatchContext.Provider>
    </LightboxContext.Provider>
  );
}
