import { ElementHandle } from 'playwright';

import { ComponentWrapper, IComponentWrapperArgs } from './component-wrapper.e2e';

export enum MenuListItem {
  techPosts = 'techPosts',
  sources = 'sources',
  about = 'about',
}

enum HeaderSelector {
  about = 'data-testid=Header-about',
  host = 'data-testid=Header',
  techPosts = 'data-testid=Header-tech_posts',
  sources = 'data-testid=Header-sources',
}

export class Header extends ComponentWrapper {
  constructor(args: Partial<IComponentWrapperArgs> = {}) {
    super({
      hostSelector: HeaderSelector.host,
      ...args,
    });
  }

  public getMenuItem(menuItem: MenuListItem): Promise<ElementHandle> {
    const menuItemSelector = HeaderSelector[menuItem];

    return this.getElementHandle(menuItemSelector);
  }
}
