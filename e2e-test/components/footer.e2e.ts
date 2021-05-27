import { ComponentWrapper, IComponentWrapperArgs } from './component-wrapper.e2e';


enum FooterSelector {
  host = 'data-testid=Footer',
}

export class Footer extends ComponentWrapper {
  constructor(args: Partial<IComponentWrapperArgs> = {}) {
    super({
      hostSelector: FooterSelector.host,
      ...args,
    });
  }
}
