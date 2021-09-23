import { ElementHandle } from 'playwright';

import {
  ComponentWrapper,
  IComponentWrapperArgs,
} from '../../../e2e-test/components/component-wrapper.e2e';

import { STATE_CHANGE_EVENT } from '../../constants';

export enum MenuListItem {
  techPosts = 'techPosts',
  carPosts = 'carPosts',
  sources = 'sources',
  about = 'about',
}

const labels = {
  [MenuListItem.techPosts]: 'Tech',
  [MenuListItem.carPosts]: 'Cars',
  [MenuListItem.sources]: 'Sources',
  [MenuListItem.about]: 'About',
};

export const menuLabelsMap = new Map<MenuListItem, string>(
  Object.entries(labels) as Array<[MenuListItem, string]>,
);

enum HeaderSelector {
  about = '[data-testid*=HeaderTabs-Tab_about]',
  host = 'data-testid=Header',
  carPosts = '[data-testid*=HeaderTabs-Tab_cars]',
  techPosts = '[data-testid*=HeaderTabs-Tab_tech]',
  sources = '[data-testid*=HeaderTabs-Tab_sources]',
}

const selectedTabSelector = 'HeaderTabs-Tab_active';

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

    // waiting for the actual state change event within SPA
    function pageFunction(STATE_CHANGE_EVENT: string): Promise<void> {
      return new Promise((resolve) => {
        window.addEventListener(
          STATE_CHANGE_EVENT,
          () => resolve(),
          { once: true },
        );
      });
    }

    await Promise.all([
      $elem.click(),
      page.waitForNavigation(),
      page.evaluate(pageFunction, STATE_CHANGE_EVENT),
    ]);

    return true;
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
