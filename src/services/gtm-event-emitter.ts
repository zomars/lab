import { WindowLocation } from '@reach/router';
import { isWindowWithGTagManager } from '../types/common.types';

export enum EGtmEventTypes {
  spa_navigation = 'spa_navigation',
  image_grid_lightbox_open = 'image_grid_lightbox_open',
  image_grid_lightbox_close = 'image_grid_lightbox_close',
  image_grid_lightbox_view = 'image_grid_lightbox_view',
  code_snippet_copy = 'code_snippet_copy',
  outbound_link_click = 'outbound_link_click',
  header_anchor_link_click = 'header_anchor_link_click',
  post_like_button_click = 'post_like_button_click',
  post_scroll_to_top_click = 'post_scroll_to_top_click',
  post_share_click = 'post_share_click',
  post_send_message_open = 'post_send_message_open',
  post_send_message_close = 'post_send_message_close',
}

interface IGtmSpaNavigationEventPayload {
  prev_spa_location?: WindowLocation;
}

interface IGtmImageGridLightboxPayload {
  lightbox_image_src: string;
}

interface IGtmImageGridLightboxViewPayload extends IGtmImageGridLightboxPayload {
  lightbox_image_weight: number; // when 1 of 25 pics then weight is 1/25
}

interface IGtmCodeSnippetCopyPayload {
  code_snippet_copy_text: string;
}

interface IGtmOutboundLinkClickPayload {
  outbound_link_label?: string;
  outbound_link_url: string;
  outbound_link_domain: string;
}

interface IGtmHeaderAnchorLinkClickPayload {
  header_text: string;
  header_anchor_id: string;
}

interface IGtmPostClickPayload {
  post_id: string; // in addition to page URL which we have by design
  post_header: string;
}

interface IGtmPostShareClickPayload extends IGtmPostClickPayload {
  share_social_network: string;
}

interface IGtmPostSendMessageClosePayload extends IGtmPostClickPayload {
  post_send_message_sent: boolean;
}

export interface IEGtmEventPayloads {
  [EGtmEventTypes.spa_navigation]: IGtmSpaNavigationEventPayload;
  [EGtmEventTypes.image_grid_lightbox_open]: IGtmImageGridLightboxPayload;
  [EGtmEventTypes.image_grid_lightbox_close]: IGtmImageGridLightboxPayload;
  [EGtmEventTypes.image_grid_lightbox_view]: IGtmImageGridLightboxViewPayload;
  [EGtmEventTypes.code_snippet_copy]: IGtmCodeSnippetCopyPayload;
  [EGtmEventTypes.outbound_link_click]: IGtmOutboundLinkClickPayload;
  [EGtmEventTypes.header_anchor_link_click]: IGtmHeaderAnchorLinkClickPayload;
  [EGtmEventTypes.post_like_button_click]: IGtmPostClickPayload;
  [EGtmEventTypes.post_scroll_to_top_click]: IGtmPostClickPayload;
  [EGtmEventTypes.post_share_click]: IGtmPostShareClickPayload;
  [EGtmEventTypes.post_send_message_open]: IGtmPostClickPayload;
  [EGtmEventTypes.post_send_message_close]: IGtmPostSendMessageClosePayload;
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
