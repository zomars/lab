import { WindowLocation } from '@reach/router';
import { isWindowWithGTagManager } from '../types/common.types';

export enum EGtmEventTypes {
  spa_navigation = 'spa_navigation',
  image_grid_lightbox_open = 'image_grid_lightbox_open',
  image_grid_lightbox_close = 'image_grid_lightbox_close',
  image_grid_lightbox_view = 'image_grid_lightbox_view',
  code_snippet_copy = 'code_snippet_copy',
}

interface IGtmSpaNavigationEventPayload {
  prev_spa_location?: WindowLocation;
}

interface IGtmImageGridLightboxPayload {
  lightbox_image_src: string;
}

interface IGtmCodeSnippetCopy {
  code_snippet_copy_text: string;
}

interface IEGtmEventPayloads {
  [EGtmEventTypes.spa_navigation]: IGtmSpaNavigationEventPayload;
  [EGtmEventTypes.image_grid_lightbox_open]: IGtmImageGridLightboxPayload;
  [EGtmEventTypes.image_grid_lightbox_close]: IGtmImageGridLightboxPayload;
  [EGtmEventTypes.image_grid_lightbox_view]: IGtmImageGridLightboxPayload;
  [EGtmEventTypes.code_snippet_copy]: IGtmCodeSnippetCopy;
}

export function gtmEventEmitter<T extends EGtmEventTypes>(
  eventType: T,
  payload?: IEGtmEventPayloads[T],
): void {
  if (!isWindowWithGTagManager(window)) {
    return;
  }

  window.dataLayer.push({
    event: eventType,
    ...payload,
  });
}
