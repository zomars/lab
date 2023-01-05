import {
  expect,
  test,
  Locator,
} from '@playwright/test';

import { waitForSpaNavigation } from '../../../../../e2e-tests/utils';

const postUrl = '/posts/2022/wait-for-single-page-navigation-and-re-hydration-playwright-react/';

test.describe('share button and popover', () => {
  let shareButton: Locator;
  let popover: Locator;

  test.beforeEach(async ({ page }) => {
    await page.goto(`${ postUrl }`, { waitUntil: 'commit' });

    await waitForSpaNavigation(page);

    shareButton = page.getByTestId('ShareButton');
    popover = page.getByTestId('ShareButton-Popover');
  });

  test.describe('share popup', () => {
    test.beforeEach(async () => {
      await expect(shareButton).toBeVisible();

      await shareButton.click();

      await expect(popover).toBeVisible();
    });

    test('opens a list of icons', async () => {
      const icons = popover.getByTestId('SocialButtons-Button');

      await expect(icons).toHaveCount(7);
    });

    test('closes on escape click', async ({ page }) => {
      await page.keyboard.press('Escape');

      await expect(popover).toBeHidden();
    });

    test('closes on mouse out click', async ({ page }) => {
      const h2 = page.locator('body');

      await h2.click();

      await expect(popover).toBeHidden();
    });
  });
});
