import { expect, test } from '@playwright/test';
import { waitForSpaNavigation } from '../../../e2e-tests/utils';

test.describe('MdxHeader', () => {
  test.describe('simple text headers', () => {
    const url = 'posts/2022/werks-reunion-monterey-2022/';
    const hash = '356';

    test('anchor click adds expected search string to the URL and scrolls to the header',
      async ({ page }) => {
        await page.goto(url, { waitUntil: 'commit' });

        await waitForSpaNavigation(page);

        const header = page.locator(`h2:has-text("${ hash }")`);
        const headerChainLink = header.locator('[data-testid*=MdxHeader-ChainLink]');

        const { y: topBeforeClick } = await header.boundingBox();

        expect(topBeforeClick).toBeGreaterThanOrEqual(50);

        await headerChainLink.click();

        const pageUrl = page.url();

        expect(pageUrl.endsWith(`${ url }#${ hash }`)).toBeTruthy();

        const { y: topAfterClick } = await header.boundingBox();

        expect(topAfterClick).toBeLessThanOrEqual(5);
      });

    test('new page with anchor hash in URL opens on the expected header', async ({ page }) => {
      await page.goto(`${ url }#${ hash }`, { waitUntil: 'commit' });

      await waitForSpaNavigation(page);

      const header = page.locator(`h2:has-text("${ hash }")`);

      const { y: topAfterClick } = await header.boundingBox();

      expect(topAfterClick).toBeLessThanOrEqual(5);
    });
  });

  test.describe('header with MDX inside', () => {
    const url = 'posts/2022/github-actions-set-output-migration/';
    const headerText = 'GitHub Action Job Using Now Deprecated';
    const hash = 'git-hub-action-job-using-now-deprecated-set-output-approach';

    test('anchor click adds expected search string to the URL and scrolls to the header',
      async ({ page }) => {
        await page.goto(url, { waitUntil: 'commit' });

        await waitForSpaNavigation(page);

        const header = page.locator(`h3:has-text("${ headerText }")`);
        const headerChainLink = header.locator('[data-testid*=MdxHeader-ChainLink]');

        const { y: topBeforeClick } = await header.boundingBox();

        expect(topBeforeClick).toBeGreaterThanOrEqual(50);

        await headerChainLink.click();

        const pageUrl = page.url();

        expect(pageUrl.endsWith(`${ url }#${ hash }`)).toBeTruthy();

        const { y: topAfterClick } = await header.boundingBox();

        expect(topAfterClick).toBeLessThanOrEqual(5);
      });

    test('new page with anchor hash in URL opens on the expected header', async ({ page }) => {
      await page.goto(`${ url }#${ hash }`, { waitUntil: 'commit' });

      await waitForSpaNavigation(page);

      const header = page.locator(`h3:has-text("${ headerText }")`);

      const { y: topAfterClick } = await header.boundingBox();

      expect(topAfterClick).toBeLessThanOrEqual(5);
    });
  });
});
