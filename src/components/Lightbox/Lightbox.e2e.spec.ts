import {
  test,
  expect,
  Locator,
} from '@playwright/test';

import { waitForSpaNavigation } from '../../../e2e-tests/utils';
import { ImageGridSelector } from '../ImageGrid/ImageGrid.e2e';
import { LightboxOverlaySelector } from './LightboxOverlay.e2e';

const postUrl = 'posts/2022/034-motorsport-summerfest/';

test.describe('Lightbox', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(postUrl, { waitUntil: 'commit' });
    await waitForSpaNavigation(page);
  });

  test('initially there is no overlay on post page', async ({ page }) => {
    const lightboxOverlay = page.locator(LightboxOverlaySelector.host);

    // no wait here
    expect(await lightboxOverlay.isVisible()).toEqual(false);
  });

  test('opens overlay on imageGrid click', async ({ page }) => {
    const imageGrid = page.locator(`:nth-match(${ ImageGridSelector.host }, 2)`);

    const imageThumb = imageGrid.locator(`:nth-match(${ ImageGridSelector.image }, 4)`);

    await imageThumb.click();

    const lightboxOverlay = page.locator(LightboxOverlaySelector.host);

    expect(await lightboxOverlay.isVisible()).toEqual(true);

    const fullSizeImage = lightboxOverlay.locator(LightboxOverlaySelector.image);

    await fullSizeImage.waitFor();

    // golden GTI
    await expect(fullSizeImage).toHaveScreenshot('full-size-image-1.png', {
      mask: [
        lightboxOverlay.locator(LightboxOverlaySelector.toolbar),
      ],
    });

    const imageTitle = lightboxOverlay.locator(LightboxOverlaySelector.title);

    expect(await imageTitle.innerText()).toMatchSnapshot('inner-text');

    const indexOf = lightboxOverlay.locator(LightboxOverlaySelector.indexOf);

    expect(await indexOf.innerText()).toMatchSnapshot('index-of');
  });

  test.describe('overlay closing', () => {
    let lightboxOverlay: Locator;

    test.beforeEach(async ({ page }) => {
      const imageGrid = page.locator(`:nth-match(${ ImageGridSelector.host }, 2)`);

      const imageThumb = imageGrid.locator(`:nth-match(${ ImageGridSelector.image }, 4)`);

      await imageThumb.click();

      lightboxOverlay = page.locator(LightboxOverlaySelector.host);

      expect(await lightboxOverlay.isVisible()).toEqual(true);
    });

    test.afterEach(async () => {
      await lightboxOverlay.waitFor({ state: 'detached' });
    });

    test('closes the overlay on close button click', async () => {
      const closeButton = await lightboxOverlay.locator(LightboxOverlaySelector.closeButton);

      await closeButton.click();
    });

    test('closes the overlay on esc button', async ({ page }) => {
      await page.keyboard.press('Escape');
    });
  });
});
