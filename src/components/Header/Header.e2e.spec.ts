import { IGlobal } from '../../../e2e-test/e2e.types';
import { PostList } from '../../page-templates/PostList/PostList.e2e';
import {
  Header,
  MenuListItem,
  menuLabelsMap,
} from './Header.e2e';

const localGlobal = global as IGlobal & typeof globalThis;

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
      'Blogs',
    );

    await expect(header.clickMenuItem(MenuListItem.techPosts)).resolves.toBe(true);

    const techPostList = new PostList();

    await expect(techPostList.isConnected).resolves.toBe(true);

    const allTechPostsTags = await techPostList.getAllPostsTags();

    const techTags = allTechPostsTags.filter(tag => tag === 'tech');

    expect(techTags.length).toBeGreaterThanOrEqual(3);

    await expect(header.clickMenuItem(MenuListItem.carPosts)).resolves.toBe(true);

    await expect(techPostList.isConnected).resolves.toBe(false);

    const carPostList = new PostList();

    await expect(carPostList.isConnected).resolves.toBe(true);

    const allCarPostsTags = await carPostList.getAllPostsTags();

    const carTags = allCarPostsTags.filter(tag => tag === 'cars');

    // seems to be affected by the race condition (dev build)
    expect(carTags.length).toBeGreaterThanOrEqual(4);

    await expect(header.clickMenuItem(MenuListItem.about)).resolves.toBe(true);

    await expect(carPostList.isConnected).resolves.toBe(false);

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
