import {
  ComponentWrapper,
  IComponentWrapperArgs,
} from '../../../e2e-tests/components/component-wrapper.e2e';

enum BlogPostSelector {
  host = '[data-testid=NumberSpeller]',
  input = '[data-testid=NumberSpeller-Input]',
  inputValidationError = '[data-testid=NumberSpeller-InputValidationError]',
  output = '[data-testid=NumberSpeller-Output]',
  button = '[data-testid=CopyToBufferButton]',
}

export class NumberSpeller extends ComponentWrapper {
  constructor(args: IComponentWrapperArgs) {
    super({
      hostSelector: BlogPostSelector.host,
      ...args,
    });
  }

  public async provideInput(value: string): Promise<void> {
    const input = await this.getElementHandle(BlogPostSelector.input);

    await input.type(value);
  }

  public async getInputValidationError(): Promise<string> {
    const error = await this.getElementHandle(BlogPostSelector.inputValidationError);

    return error.innerText();
  }

  public async readOutput(): Promise<string> {
    const output = await this.getElementHandle(BlogPostSelector.output);

    return output.inputValue();
  }

  public async outputIsEnabled(): Promise<boolean> {
    const output = await this.getElementHandle(BlogPostSelector.output);

    return output.isEnabled();
  }

  public async isCopyButtonEnabled(): Promise<boolean> {
    const button = await this.getElementHandle(BlogPostSelector.button);

    return button.isEnabled();
  }

  public waitForEnabledCopyButton(): Promise<void> {
    return this.getElementHandle(`${ BlogPostSelector.button }:enabled`)
      .then(() => undefined);
  }

  public async copyResultViaButton(): Promise<void> {
    const button = await this.getElementHandle(BlogPostSelector.button);

    await button.click();

    // since copy to buffer is actually async (in theory at least)
    await button.isEnabled();
  }

  public async tabOutFromInput(): Promise<void> {
    const input = await this.getElementHandle(BlogPostSelector.input);

    await input.focus();

    await input.press('Tab');
  }
}
