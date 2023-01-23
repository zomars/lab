import { useContext } from 'react';

import {
  ILightboxState,
  LightboxContext,
  LightboxDispatchContext,
  TLightboxContextAction,
} from '../react-contexts/lightbox.context';

export function useLightbox(): ILightboxState {
  return useContext(LightboxContext);
}

export function useLightboxDispatch(): (action: TLightboxContextAction) => void {
  return useContext(LightboxDispatchContext);
}
