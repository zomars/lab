import { expect, test } from '@playwright/test';

import { networkThrottleOptions } from '../../../../e2e-tests/constants';

test.describe.only('site header article', () => {
  test.beforeEach(async ({ page }) => {
    const cdpSession = await page.context().newCDPSession(page);

    await cdpSession.send('Network.enable');

    await cdpSession.send(
      'Network.emulateNetworkConditions',
      networkThrottleOptions,
    );

    /* await context.tracing.start({
      screenshots: true,
      snapshots: true,
    }); */

    await page.goto('/');
  });

  test('click navigates user between pages - v1', async ({ page }) => {
    // await waitForSpaNavigation(page);

    const postHeader = page.locator(
      '[data-testid=PostPreview-Header]',
      // { hasText: 'Playwright' },
    ).first();

    // await expect(postHeader).toBeVisible();

    await expect(postHeader).toContainText('Playwright');

    // const header = page.locator('[data-testid=Header]');

    const sourcesLink = page.locator('[data-testid*=HeaderTabs-Tab_about]');

    await sourcesLink.click();

    const sourcesSectionHeader = page.locator(
      'h2',
      // { hasText: 'Audi B8' },
    ).first();

    // try {
    // await expect(carsPostHeader).toBeVisible();

    await expect(sourcesSectionHeader).toContainText('Opensource');
    /* } catch (e) {
      await context.tracing.stop({ path: 'trace.zip' });
    } */
  });

  test.skip('click navigates user between pages - v2', async ({ context, page }) => {
    // await waitForSpaNavigation(page);

    await page.waitForSelector('[data-testid=PostPreview-Header]:has-text("View and Component")');

    const header = await page.waitForSelector('[data-testid=Header]');

    const carsLink = await header.waitForSelector('[data-testid*=HeaderTabs-Tab_cars]');

    await carsLink.click();

    const carsPostHeader =
      await page.waitForSelector('[data-testid=PostPreview-Header]:has-text("Audi b8")');

    try {
      await expect(carsPostHeader.innerText()).resolves.toContain('Audi B8');
    } catch (e) {
      await context.tracing.stop({ path: 'trace.zip' });
    }
  });
});
