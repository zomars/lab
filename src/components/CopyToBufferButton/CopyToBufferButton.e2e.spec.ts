import {
  expect,
  test,
  Locator,
} from '@playwright/test';

import { waitForSpaNavigation } from '../../../e2e-tests/utils';

const postUrl = '/posts/2022/github-actions-set-output-migration/';

test.describe('copy code button', () => {
  let codeSnippet: Locator;
  let copyButton: Locator;

  test.beforeEach(async ({ page, context }) => {
    await context.grantPermissions([
      'clipboard-read',
      'clipboard-write',
    ]);

    await page.goto(`${ postUrl }`, { waitUntil: 'commit' });

    await waitForSpaNavigation(page);

    codeSnippet = page.getByTestId('CodeSnippet').first();
    copyButton = page.getByTestId('CopyToBufferButton').first();
  });

  test('button is invisible by default and shows up on codeSnippet hover',
    async () => {
      await expect(codeSnippet).toBeVisible();

      await expect(copyButton).toBeVisible({ visible: false });

      await codeSnippet.hover();

      await expect(copyButton).toBeVisible();
    },
  );

  test('copies text into the buffer on click and shows an alert', async ({ page }) => {
    await codeSnippet.hover();

    await copyButton.click();

    const alert = page.getByTestId('SnackbarAlertsPortal-Snackbar');

    await expect(alert).toBeVisible();

    await expect(alert).toHaveText('Code snippet copied');

    await expect(alert).toBeHidden();

    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());

    expect(clipboardText).toMatchSnapshot();
  });
});
