import { expect, test } from '@playwright/test';

import { waitForSpaNavigation } from '../../../e2e-tests/utils';
import { PostPreview } from './PostPreview.e2e';

const activeTag = 'tech';

test.describe('site header', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/tags/${ activeTag }/1`, { waitUntil: 'commit' });

    await waitForSpaNavigation(page);
  });

  test('first preview has all expected elements', async ({ page }) => {
    const postPreview = new PostPreview({ page });

    await expect(postPreview.isConnected).resolves.toBe(true);

    await expect(postPreview.getTitleText()).resolves.toMatchSnapshot();

    await expect(postPreview.getExcerptText()).resolves.toMatchSnapshot();

    await expect(postPreview.getPostedDateText()).resolves.toMatchSnapshot();

    await expect(postPreview.getPostReadTime()).resolves.toMatchSnapshot();
  });

  test('post with image is present and has an image', async ({ page }) => {
    const postPreview = new PostPreview({
      page,
      withPreview: true,
    });

    await expect(postPreview.isConnected).resolves.toBe(true);

    await expect(postPreview.getImage()).resolves.toBeTruthy();
  });

  test.describe('post link click', () => {
    let postPreview: PostPreview;

    test.beforeEach(async ({ page }): Promise<void> => {
      postPreview = new PostPreview({
        page,
        withPreview: true,
      });

      await postPreview.isConnected;
    });

    test('works on image', async ({ page }) => {
      const $image = await postPreview.getImage();

      const [, urlPath] = await Promise.all([
        $image.click(),
        waitForSpaNavigation(page),
      ]);

      await expect(urlPath).toMatchSnapshot();
    });

    test('works on title', async ({ page }) => {
      const $title = await postPreview.getTitle();

      const [, urlPath] = await Promise.all([
        $title.click(),
        waitForSpaNavigation(page),
      ]);

      expect(urlPath).toMatchSnapshot();
    });

    test('works on excerpt', async ({ page }) => {
      const $excerpt = await postPreview.getExcerpt();

      await Promise.all([
        $excerpt.click(),
        waitForSpaNavigation(page),
      ]);

      const { pathname: urlPath } = new URL(page.url());

      await expect(urlPath).toMatchSnapshot();
    });
  });
});
