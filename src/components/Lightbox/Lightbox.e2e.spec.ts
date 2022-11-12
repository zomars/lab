import { test, expect } from '@playwright/test';
import { BlogPost } from '../../page-templates/BlogPost/BlogPost.e2e';
import { ImageGrid } from '../ImageGrid/ImageGrid.e2e';
import { LightboxOverlay } from './LightboxOverlay.e2e';

const postUrl = 'posts/2022/034-motorsport-summerfest/';

test.describe('Lightbox', () => {
  test.beforeEach(({ page }) => {
    return page.goto(postUrl);
  });

  test('initially there is no overlay on post page', async ({ page }) => {
    const lightboxOverlay = new LightboxOverlay({
      page,
      waitForSelectorOptions: {
        timeout: 5000, // default timeout is 10000
      },
    });

    await expect(lightboxOverlay.isConnected).rejects.toThrow();
  });

  test('opens overlay on imageGrid click', async ({ page }) => {
    const blogPost = new BlogPost({ page });

    await blogPost.isConnected;

    const [imageGridHandler] = await blogPost.getImageGrids();

    const imageGrid = new ImageGrid({
      page,
      hostElement: imageGridHandler,
    });

    await imageGrid.isConnected;

    const [imageThumb] = await imageGrid.getImages();

    await imageThumb.click();

    const lightboxOverlay = new LightboxOverlay({ page });

    await lightboxOverlay.isConnected;

    await lightboxOverlay.getImage();

    // fixme: Figure out how to consistently pick the nth image on the page
    // expect(await image.screenshot()).toHaveScreenshot();
  });

  test.describe('overlay closing', () => {
    let lightboxOverlay: LightboxOverlay;

    test.beforeEach(async ({ page }) => {
      const blogPost = new BlogPost({ page });

      await blogPost.isConnected;

      const [imageGridHandler] = await blogPost.getImageGrids();

      const imageGrid = new ImageGrid({
        page,
        hostElement: imageGridHandler,
      });

      await imageGrid.isConnected;

      const [imageThumb] = await imageGrid.getImages();

      await imageThumb.click();

      lightboxOverlay = new LightboxOverlay({ page });

      await lightboxOverlay.isConnected;
    });

    test.afterEach(async () => {
      await expect(lightboxOverlay.waitForDisconnected(5000)).resolves.toEqual(true);
    });

    test('closes the overlay on close button click', async () => {
      const closeButton = await lightboxOverlay.getCloseButton();

      await closeButton.click();
    });

    test('closes the overlay on esc button', async ({ page }) => {
      await page.keyboard.press('Escape');
    });
  });
});
