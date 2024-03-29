import { expect, test } from '@playwright/test';

import { PostList } from '../../page-templates/PostList/PostList.e2e';
import {
  Header,
  MenuListItem,
  menuLabelsMap,
} from './Header.e2e';

test.describe('site header', () => {
  let header: Header = null;

  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    header = new Header({ page });
  });

  test('is present on index page', async () => {
    await expect(header.isConnected).resolves.toBe(true);

    const promises = Array.from(
      menuLabelsMap.entries(),
    )
      .map(async ([key, label]: [MenuListItem, string]) => {
        const $element = await header.getMenuItem(key);

        return expect($element.innerText()).resolves.toEqual(label);
      });

    await Promise.all(promises);
  });

  test('click navigates user between pages', async ({ page }) => {
    await expect(header.isConnected).resolves.toBe(true);

    await expect(header.clickMenuItem(MenuListItem.sources)).resolves.toBe(true);

    const blogsHeader = page.locator('h2', { hasText: 'blogs' });

    await expect(blogsHeader).toBeVisible();

    await expect(header.clickMenuItem(MenuListItem.techPosts)).resolves.toBe(true);

    const techPostList = new PostList({ page });

    await expect(techPostList.isConnected).resolves.toBe(true);

    const techPosts = await techPostList.getAllPosts();

    const techTitles = await Promise.all(
      techPosts.map(post => post.getTitleText()),
    );

    await expect(techTitles.join()).toMatchSnapshot();

    await expect(header.clickMenuItem(MenuListItem.carPosts)).resolves.toBe(true);

    await expect(techPostList.isConnected).resolves.toBe(false);

    const autoPostList = new PostList({ page });

    await expect(autoPostList.isConnected).resolves.toBe(true);

    const autoPosts = await autoPostList.getAllPosts();

    const autoTitles = await Promise.all(
      autoPosts.map(post => post.getTitleText()),
    );

    await expect(autoTitles.join()).toMatchSnapshot();

    await expect(header.clickMenuItem(MenuListItem.about)).resolves.toBe(true);

    await expect(autoPostList.isConnected).resolves.toBe(false);

    const aboutHeader = page.locator('h1', { hasText: 'about' });

    await expect(aboutHeader).toBeVisible();
  });

  test('highlights selected tab only', async () => {
    await expect(header.isConnected).resolves.toBe(true);

    await expect(header.isSelected(MenuListItem.techPosts)).resolves.toBe(true);

    await expect(header.isSelected(MenuListItem.carPosts)).resolves.toBe(false);
  });
});
