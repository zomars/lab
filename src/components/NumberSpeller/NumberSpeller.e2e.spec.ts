import { IGlobal } from '../../../e2e-test/e2e.types';
import { waitForSpaNavigation } from '../../../e2e-test/utils';

import {
  NumberSpeller,
} from './NumberSpeller.e2e';

const localGlobal = global as IGlobal & typeof globalThis;

describe('Number Speller form', () => {
  let form: NumberSpeller = null;

  beforeEach(async () => {
    await jestPlaywright.resetContext();

    context.setDefaultTimeout(localGlobal.defaultTimeout);

    await context.grantPermissions([
      'clipboard-read',
      'clipboard-write',
    ]);

    await page.goto(`${localGlobal.url}/projects/number-speller`, { waitUntil: 'commit' });

    await waitForSpaNavigation(page);

    form = new NumberSpeller();

    await form.isConnected;
  });

  it('spells out number as expected - "1073741824"', async () => {
    await form.provideInput('1073741824');

    await form.waitForEnabledCopyButton();

    const output = await form.readOutput();

    expect(output).toBe(
      'one billion seventy three million seven hundred ' +
      'forty one thousand eight hundred twenty four',
    );
  });

  it('spells out number as expected - "0"', async () => {
    await form.provideInput('0');

    await form.waitForEnabledCopyButton();

    const output = await form.readOutput();

    expect(output).toBe(
      'zero',
    );
  });

  it('renders button and textarea in disabled form by default', async () => {
    await expect(form.outputIsEnabled()).resolves.toBe(false);
    await expect(form.isCopyButtonEnabled()).resolves.toBe(false);
  });

  const invalidTests = [
    {
      input: 'whatever',
      error: 'Please provide a valid number',
    }, {
      input: '-100',
      error: 'Negative values are not supported',
    },
    {
      input: '11111111111111',
      error: 'Number too large',
    },
  ];

  invalidTests.forEach(({ input, error }) => {
    it(`handles incorrect input accordingly - "${ input }"`, async () => {
      await form.provideInput(input);

      await expect(form.readOutput()).resolves.toBe('');

      await expect(form.outputIsEnabled()).resolves.toBe(false);
      await expect(form.isCopyButtonEnabled()).resolves.toBe(false);

      await expect(form.getInputValidationError()).resolves.toBe(error);
    });
  });

  it('copy button copies result into the clipboard', async () => {
    await form.provideInput('100');

    const output = await form.readOutput();

    expect(output).toBe('one hundred');

    await form.copyResultViaButton();

    await expect(
      page.evaluate(() => navigator.clipboard.readText()),
    ).resolves.toBe('one hundred');
  });

  // this testing approach works in Chrome only
  it('focus on textarea selects the result to be copied by the user', async () => {
    await form.provideInput('200');

    await form.waitForEnabledCopyButton();

    await form.tabOutFromInput();

    await expect(
      page.evaluate(() => window.getSelection().toString()),
    ).resolves.toBe('two hundred');
  });
});
