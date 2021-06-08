import { ElementHandle } from 'playwright';

import { ComponentWrapper, IComponentWrapperArgs } from './component-wrapper.e2e';

export enum MenuListItem {
  techPosts = 'techPosts',
  carPosts = 'carPosts',
  sources = 'sources',
  about = 'about',
}

const labels = {
  [MenuListItem.techPosts]: 'Tech Posts',
  [MenuListItem.carPosts]: 'Car Posts',
  [MenuListItem.sources]: 'Sources',
  [MenuListItem.about]: 'About',
};

export const menuLabelsMap = new Map<MenuListItem, string>(
  Object.entries(labels) as Array<[MenuListItem, string]>,
);

enum HeaderSelector {
  about = '[data-testid*=Header-Tab_about]',
  host = 'data-testid=Header',
  carPosts = '[data-testid*=Header-Tab_car_posts]',
  techPosts = '[data-testid*=Header-Tab_tech_posts]',
  sources = '[data-testid*=Header-Tab_sources]',
}

const selectedTabSelector = 'Header-Tab_selected';

export class Header extends ComponentWrapper {
  constructor(args: Partial<IComponentWrapperArgs> = {}) {
    super({
      hostSelector: HeaderSelector.host,
      ...args,
    });
  }

  /**
   * Return ElementHandle by menuitem enum.
   */
  public getMenuItem(menuItem: MenuListItem): Promise<ElementHandle> {
    const menuItemSelector = HeaderSelector[menuItem];

    return this.getElementHandle(menuItemSelector);
  }

  /**
   * Click menu item by enum. Waits for triggered transition to succeed.
   */
  public async clickMenuItem(menuItem: MenuListItem): Promise<boolean> {
    const $elem = await this.getMenuItem(menuItem);

    return $elem.click()
      .then(() => true);
  }

  /**
   * Return true is menu item passed via enum is marked as selected. Return false
   * otherwise.
   */
  public async isSelected(menuItem: MenuListItem): Promise<boolean> {
    const $elem = await this.getMenuItem(menuItem);

    const testId = await $elem.getAttribute('data-testid');

    return testId.split(' ').includes(selectedTabSelector);
  }
}
