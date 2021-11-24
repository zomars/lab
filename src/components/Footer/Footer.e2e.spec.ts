import { IGlobal } from '../../../e2e-test/e2e.types';
import { ScreenWidth } from '../../../e2e-test/constants';
import { Footer } from './Footer.e2e';

const localGlobal = global as IGlobal & typeof globalThis;

const urlsToTest = [
  '/',
  '/tags/tech/1/',
  '/tags/cars/1/',
  '/sources/',
  '/about/',
];

describe('site header', () => {
  beforeEach(async () => {
    await jestPlaywright.resetContext();

    context.setDefaultTimeout(localGlobal.defaultTimeout);
  });

  urlsToTest.forEach((url: string) => {
    it(`is present on ${ url }`, async () => {
      await page.goto(`${ localGlobal.url }${ url }`);

      const footer = new Footer();

      await expect(footer.isConnected).resolves.toBe(true);

      const icons = await footer.getIcons();

      expect(icons).toHaveLength(3);

      await expect(footer.getCopyright()).resolves.toBeTruthy();

      await expect(footer.getJoyNote()).resolves.toBeTruthy();

      await expect(footer.getJoyNote()).resolves.toBeTruthy();
    });
  });

  it('hides enjoy-note on medium screen resolution', async () => {
    await page.setViewportSize({
      width: ScreenWidth.md,
      height: ScreenWidth.md,
    });

    await page.goto(localGlobal.url);

    const footer = new Footer();

    await expect(footer.isConnected).resolves.toBe(true);

    await expect(footer.getJoyNote()).rejects.toThrow(); // not found

    await expect(footer.getCopyright()).resolves.toBeTruthy();
  });
});
