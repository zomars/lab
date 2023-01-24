import {
  expect,
  test,
  Locator,
} from '@playwright/test';

import { waitForSpaNavigation } from '../../../../../e2e-tests/utils';

const postUrl = '/posts/2022/wait-for-single-page-navigation-and-re-hydration-playwright-react/';

test.describe('share buttons', () => {
  let shareButton: Locator;
  let popover: Locator;
  let alert: Locator;

  test.beforeEach(async ({ page }) => {
    await page.goto(`${ postUrl }`, { waitUntil: 'commit' });

    await waitForSpaNavigation(page);

    shareButton = page.getByTestId('ShareButton');
    popover = page.getByTestId('ShareButton-Popover');
    alert = page.getByTestId('SnackbarAlertsPortal-Snackbar');
  });

  test.describe('copy url button', () => {
    let icon: Locator;

    test.beforeEach(async () => {
      icon = popover.locator('.SocialButtons-Button_type_copy_url');

      await shareButton.click();
    });

    test('copies url into the buffer', async ({ page, context }) => {
      await context.grantPermissions([
        'clipboard-read',
        'clipboard-write',
      ]);

      await icon.click();

      await expect(popover).toBeHidden();

      await expect(alert).toHaveText('Link copied');

      const clipboardText = await page.evaluate(() => navigator.clipboard.readText());

      expect(clipboardText).toEqual(expect.stringContaining(postUrl));

      await expect(alert).toBeHidden();
    });
  });

  test.describe('share buttons', () => {
    const socialTypes = [
      'twitter',
      'telegram',
      'linkedin',
      'facebook',
      'reddit',
    ];

    const originPlaceholder = 'https://example.com';

    test.beforeEach(async ({ context }) => {
      const clickPromise = shareButton.click();

      // we don't want to hit those public APIs since they cause redirects and mess with validation
      await context.route(/(?:facebook|linkedin|twitter|reddit|telegram)\.(?:com|me)/, (route) => {
        route.fulfill({
          status: 200,
          body: 'ok',
        });
      });

      await clickPromise;
    });

    for (const type of socialTypes) {
      // eslint-disable-next-line no-loop-func
      test(`${ type } opens a new window with expected url on click`, async ({ page, baseURL }) => {
        const icon = popover.locator(`.SocialButtons-Button_type_${ type }`);
        const popupPromise = page.waitForEvent('popup');

        await icon.click();

        const popupPage = await popupPromise;

        const popupUrl = popupPage.url();

        const encodedBaseUrl = encodeURIComponent(baseURL!);

        const popupUrlNoOrigin = popupUrl.replace(encodedBaseUrl, originPlaceholder);

        expect(popupUrlNoOrigin).toMatchSnapshot(`${ type }.txt`);
      });
    }
  });
});
