import { ElementHandle } from 'playwright';
import {
  ComponentWrapper,
  IComponentWrapperArgs,
} from '../../../e2e-tests/components/component-wrapper.e2e';

export enum LightboxOverlaySelector {
  host = 'data-testid=Lightbox-Portal-Content',
  image = '.ril__image',
  closeButton = '.ril__closeButton',
}

export class LightboxOverlay extends ComponentWrapper {
  constructor(args: IComponentWrapperArgs) {
    super({
      hostSelector: LightboxOverlaySelector.host,
      ...args,
    });
  }

  public getCloseButton(): Promise<ElementHandle | null> {
    return this.getElementHandle(LightboxOverlaySelector.closeButton);
  }

  public getImage(): Promise<ElementHandle<HTMLImageElement>> {
    return this.getElementHandle(LightboxOverlaySelector.image);
  }
}
