import { test, expect } from '@playwright/test';
import { waitForSpaNavigation } from '../../../e2e-tests/utils';

const postUrl = 'posts/2022/034-motorsport-summerfest/';

test.describe('ImageGrid', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(postUrl, { waitUntil: 'commit' });

    await waitForSpaNavigation(page);
  });

  test('post has the expected number of ImageGrids', async ({ page }) => {
    const imageGrids = page.getByTestId('ImageGrid');

    await expect(imageGrids).toHaveCount(3);
  });

  test('second ImageGrid has the expected number of images', async ({ page }) => {
    const imageGrid = page.getByTestId('ImageGrid').nth(1);
    const images = imageGrid.locator('[data-testid=ImageGridRow-Cell] picture img');

    await expect(images).toHaveCount(6);

    let index = 0;

    for (const image of await images.all()) {
      await expect(image).toHaveScreenshot(`grid-image-${ index }.png`, {
        animations: 'disabled',
      });

      index++;
    }
  });

  test('4 images out of 6 have expected title', async ({ page }) => {
    const imageGrid = page.getByTestId('ImageGrid').nth(1);
    const images = imageGrid
      .locator('[data-testid=ImageGridRow-Cell]:has([data-testid=ImageGridRow-Cell-Title])');

    await expect(images).toHaveCount(4);

    let index = 0;

    for (const image of await images.all()) {
      await image.hover();

      const title = await image.getByTestId('ImageGridRow-Cell-Title');

      await expect(title.innerText()).resolves.toMatchSnapshot(`image-title-${ index}.txt`);

      index++;
    }
  });

  test('image click opens expected popup', async ({ page }) => {
    const imageGrid = page.getByTestId('ImageGrid').nth(1);
    const image = imageGrid.getByTestId('ImageGridRow-Cell').nth(3);

    await image.click();

    const popover = page.getByTestId('Lightbox-Portal-Content');

    const imageTitle = popover.getByTestId('LightboxImageTitle-Title');

    await expect(imageTitle.innerText()).resolves.toMatchSnapshot('image-overlay-title');

    const indexOf = popover.getByTestId('LightboxImageTitle-IndexOf');

    await expect(indexOf.innerText()).resolves.toMatchSnapshot('image-overlay-index-of');

    const mainImage = popover.locator('.ril-image-current');

    await expect(mainImage).toBeVisible();

    const maskElements = popover.locator('.ril__toolbar, .ril__navButtons');

    await expect(mainImage).toHaveScreenshot('image-overlay-image.png', {
      animations: 'disabled',
      mask: [
        maskElements,
      ],
    });
  });
});
