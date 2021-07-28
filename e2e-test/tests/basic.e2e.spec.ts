import { IGlobal } from '../e2e.types';

const localGlobal = global as IGlobal & typeof globalThis;

describe('basics', () => {
  beforeEach(async () => {
    await jestPlaywright.resetContext();

    context.setDefaultTimeout(localGlobal.defaultTimeout);

    await page.goto(localGlobal.url);
  });

  it('has list of posts', async () => {
    await expect(page).toHaveText(
      'data-testid=PostPreview-Excerpt',
      'Everyone knows  AngularJs',
    );
  });
});
