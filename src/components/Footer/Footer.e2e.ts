import { ElementHandle } from 'playwright';

import {
  ComponentWrapper,
  IComponentWrapperArgs,
} from '../../../e2e-tests/components/component-wrapper.e2e';

enum FooterSelector {
  host = 'data-testid=Footer',
  icons = 'data-testid=Footer-Icon',
  copyright = 'data-testid=Footer-Copyright',
  joyNote = 'data-testid=Footer-JoyNote',
}

export class Footer extends ComponentWrapper {
  constructor(args: IComponentWrapperArgs) {
    super({
      hostSelector: FooterSelector.host,
      ...args,
    });
  }

  public getIcons(): Promise<ElementHandle[]> {
    return this.getElements(FooterSelector.icons);
  }

  public getCopyright(): Promise<ElementHandle | null> {
    return this.getElementHandle(FooterSelector.copyright);
  }

  public getJoyNote(): Promise<ElementHandle | null> {
    return this.getElementHandle(FooterSelector.joyNote);
  }
}
