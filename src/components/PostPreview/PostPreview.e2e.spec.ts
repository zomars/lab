import { IGlobal } from '../../../e2e-test/e2e.types';
import { waitForSpaNavigation } from '../../../e2e-test/utils';
import { PostPreview } from './PostPreview.e2e';

const localGlobal = global as IGlobal & typeof globalThis;

const activeTag = 'tech';

describe('site header', () => {
  beforeEach(async () => {
    await jestPlaywright.resetContext();

    context.setDefaultTimeout(localGlobal.defaultTimeout);

    await page.goto(`${ localGlobal.url }/tags/${ activeTag }/1`, { waitUntil: 'commit' });

    await waitForSpaNavigation(page);
  });

  it('first preview has all expected elements', async () => {
    const postPreview = new PostPreview();

    await expect(postPreview.isConnected).resolves.toBe(true);

    await expect(postPreview.getTitleText()).resolves.toMatchSnapshot();

    await expect(postPreview.getExcerptText()).resolves.toMatchSnapshot();

    await expect(postPreview.getPostedDateText()).resolves.toMatchSnapshot();

    await expect(postPreview.getPostReadTime()).resolves.toMatchSnapshot();
  });

  it('post with image is present and has an image', async () => {
    const postPreview = new PostPreview({ withPreview: true });

    await expect(postPreview.isConnected).resolves.toBe(true);

    await expect(postPreview.getImage()).resolves.toBeTruthy();
  });

  describe('post link click', () => {
    let postPreview: PostPreview;

    beforeEach(async (): Promise<void> => {
      postPreview = new PostPreview({ withPreview: true });

      await postPreview.isConnected;
    });

    it('works on image', async () => {
      const $image = await postPreview.getImage();

      const [, urlPath] = await Promise.all([
        $image.click(),
        waitForSpaNavigation(page),
      ]);

      await expect(urlPath).toMatchSnapshot();
    });

    it('works on title', async () => {
      const $title = await postPreview.getTitle();

      const [, urlPath] = await Promise.all([
        $title.click(),
        waitForSpaNavigation(page),
      ]);

      expect(urlPath).toMatchSnapshot();
    });

    it('works on excerpt', async () => {
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
