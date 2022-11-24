import { expect, test } from '@playwright/test';
import { waitForSpaNavigation } from '../../../e2e-tests/utils';

test.describe('MdxLink', () => {
  test('outbound link click opens new tab', async ({ page, context }) => {
    await page.goto('/posts/2022/github-actions-set-output-migration/');

    const linkLabel = 'Job Summary';
    const outboundLink = page.locator(`:nth-match(a:text("${ linkLabel }"), 1)`);
    const linkUrl = await outboundLink.getAttribute('href');

    expect(linkUrl).toBeDefined();

    const [newTabPage] = await Promise.all([
      context.waitForEvent('page'),
      outboundLink.click(),
    ]);

    expect(newTabPage.url()).toEqual(linkUrl);
  });

  test('internal link click works through the view render', async ({ page }) => {
    await page.goto('/posts/2021/angularjs-good-parts/', { waitUntil: 'commit' });

    await waitForSpaNavigation(page);

    const linkLabel = 'LTS support';
    const innerLink = page.locator(`a:text("${ linkLabel }")`);
    const linkUrl = await innerLink.getAttribute('href');

    expect(linkUrl).toBeDefined();

    const [urlPath] = await Promise.all([
      waitForSpaNavigation(page),
      innerLink.click(),
    ]);

    expect(urlPath).toEqual(linkUrl);
  });
});
