import { IGlobal } from '../../../e2e-test/e2e.types';
import { Header, MenuListItem, menuLabelsMap } from './Header.e2e';

const localGlobal = global as IGlobal & typeof globalThis;

const postsPerPage = 4;

const postTagSelector = '[data-testid=PostTags-Tag]';

describe('site header', () => {
  let header: Header = null;

  beforeEach(async () => {
    await jestPlaywright.resetContext();

    context.setDefaultTimeout(localGlobal.defaultTimeout);

    await page.goto(localGlobal.url);

    header = new Header();
  });

  it('is present on index page', async () => {
    await expect(header.isConnected).resolves.toBe(true);

    const promises = Array.from(
      menuLabelsMap.entries(),
    )
      .map(async ([key, label]: [MenuListItem, string]) => {
        const $element = await header.getMenuItem(key);

        return expect($element).toHaveText(label);
      });

    await Promise.all(promises);
  });

  it('click navigates user between pages', async () => {
    await expect(header.isConnected).resolves.toBe(true);

    await expect(header.clickMenuItem(MenuListItem.sources)).resolves.toBe(true);

    await expect(page).toHaveText(
      'h2',
      'Blogs to follow',
    );

    await expect(header.clickMenuItem(MenuListItem.techPosts)).resolves.toBe(true);

    await expect(page).toHaveSelectorCount(
      `${postTagSelector}:has-text("tech")`,
      postsPerPage,
    );

    await expect(header.clickMenuItem(MenuListItem.carPosts)).resolves.toBe(true);

    await expect(page).toHaveSelectorCount(
      `${postTagSelector}:has-text("cars")`,
      postsPerPage,
    );

    await expect(header.clickMenuItem(MenuListItem.about)).resolves.toBe(true);

    await expect(page).toHaveText(
      'h1',
      'About me',
    );
  });

  it('highlights selected tab only', async () => {
    await expect(header.isConnected).resolves.toBe(true);

    await expect(header.isSelected(MenuListItem.techPosts)).resolves.toBe(true);

    await expect(header.isSelected(MenuListItem.carPosts)).resolves.toBe(false);
  });
});
