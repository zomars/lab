import { Footer } from '../components/footer.e2e';
import { IGlobal } from '../e2e.types';

const localGlobal = global as IGlobal & typeof globalThis;

describe('basics', () => {
  beforeEach(async () => {
    await jestPlaywright.resetContext();

    context.setDefaultTimeout(localGlobal.defaultTimeout);

    await page.goto(localGlobal.url);
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
