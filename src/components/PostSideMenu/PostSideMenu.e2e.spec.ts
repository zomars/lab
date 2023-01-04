import {
  expect,
  test,
  Locator,
} from '@playwright/test';

import { waitForSpaNavigation } from '../../../e2e-tests/utils';

const postUrl = '/posts/2022/wait-for-single-page-navigation-and-re-hydration-playwright-react/';

test.describe('post side menu', () => {
  let menu: Locator;

  test.beforeEach(async ({ page }) => {
    await page.goto(`${ postUrl }`, { waitUntil: 'commit' });

    await waitForSpaNavigation(page);

    menu = page.getByTestId('PostSideMenu');
  });

  test('is present on blog post page', async () => {
    await expect(menu).toBeVisible();
  });

  test.describe('scroll to the top button', () => {
    let scrollButton: Locator;

    test.beforeEach(() => {
      scrollButton = menu.getByTestId('ScrollToTheTopButton');
    });

    test('is present in the menu in disabled state', async () => {
      await expect(scrollButton).toBeVisible();
      await expect(scrollButton).toBeDisabled();
    });

    test('is enabled after some scrolling', async ({ page }) => {
      await page.keyboard.press('PageDown');
      await expect(scrollButton).toBeEnabled();
    });

    test('scrolls to the top once clicked', async ({ page }) => {
      await page.keyboard.press('PageDown');
      await scrollButton.click();
      await page.mainFrame().waitForFunction(() => window.scrollY === 0);
    });
  });

  test.describe('share button', () => {
    let shareButton: Locator;
    let sharePopover: Locator;

    test.beforeEach(({ page }) => {
      shareButton = menu.getByTestId('ShareButton');
      sharePopover = page.getByTestId('ShareButton-Popover');
    });

    test('opens share menu on click', async () => {
      await shareButton.click();
      await expect(sharePopover).toBeVisible();
    });

    test('closes share menu when clicked inside', async () => {
      await shareButton.click();
      await expect(sharePopover).toBeVisible();

      const button = sharePopover.getByTestId('SocialButtons-Button').nth(3);

      await button.click();

      await expect(sharePopover).toBeHidden();
    });
  });

  test.describe('like button', () => {
    let likeButton: Locator;

    test.beforeEach(({ page }) => {
      likeButton = page.getByTestId('LikeButton');
    });

    test('is present and enabled by default', async () => {
      await expect(likeButton).toBeVisible();
      await expect(likeButton).toBeEnabled();
    });

    test('disables after click and renders an alert', async ({ page }) => {
      await likeButton.click();

      const alert = page.getByTestId('SnackbarAlertsPortal-Snackbar');

      await expect(alert).toBeVisible();

      await expect(likeButton).toBeDisabled();

      await expect(alert).toBeHidden();
    });
  });
});
