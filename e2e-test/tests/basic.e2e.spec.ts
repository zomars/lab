import { Footer } from '../components/footer.e2e';
import { Header, MenuListItem } from '../components/header.e2e';
import { IGlobal } from '../e2e.types';

const localGlobal = global as IGlobal & typeof globalThis;

describe('basics', () => {
  beforeEach(async () => {
    await jestPlaywright.resetContext();

    context.setDefaultTimeout(localGlobal.defaultTimeout);

    await page.goto(localGlobal.url);
  });

  it('has header with expected links', async () => {
    const header = new Header();

    await expect(header.isConnected).resolves.toBe(true);

    const $techPosts = await header.getMenuItem(MenuListItem.techPosts);

    await expect($techPosts).toHaveText('Tech Posts');

    const $sources = await header.getMenuItem(MenuListItem.sources);

    await expect($sources).toHaveText('Sources');

    const $about = await header.getMenuItem(MenuListItem.about);

    await expect($about).toHaveText('About');
  });

  it('has footer', async () => {
    const footer = new Footer();

    await expect(footer.isConnected).resolves.toBe(true);
  });

  it('has list of posts', async () => {
    await expect(page).toHaveText(
      'data-testid=PostPreview-Excerpt',
      'Everyone knows AngularJs',
    );
  });
});
