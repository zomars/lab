import { expect, test } from '@playwright/test';

import { ScreenWidth } from '../../../e2e-tests/constants';
import { Footer } from './Footer.e2e';

const urlsToTest = [
  '/',
  '/tags/tech/1/',
  '/tags/cars/1/',
  '/sources/',
  '/about/',
];

test.describe('site header', () => {
  urlsToTest.forEach((url: string) => {
    test(`is present on ${ url }`, async ({ page }) => {
      await page.goto(url);

      const footer = new Footer({ page });

      await expect(footer.isConnected).resolves.toBe(true);

      const icons = await footer.getIcons();

      expect(icons).toHaveLength(3);

      await expect(footer.getCopyright()).resolves.toBeTruthy();

      await expect(footer.getJoyNote()).resolves.toBeTruthy();

      await expect(footer.getJoyNote()).resolves.toBeTruthy();
    });
  });

  test.skip('hides enjoy-note on medium screen resolution', async ({ page }) => {
    await page.setViewportSize({
      width: ScreenWidth.md,
      height: ScreenWidth.md,
    });

    await page.goto('/');

    const footer = new Footer({ page });

    await expect(footer.isConnected).resolves.toBe(true);

    await expect(footer.getCopyright()).resolves.toBeTruthy();

    await expect(footer.getJoyNote()).rejects.toThrow(); // not found
  });
});
