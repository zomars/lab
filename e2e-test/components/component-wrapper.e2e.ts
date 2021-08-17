import { ElementHandle } from 'playwright';
import { isString } from 'lodash';

export interface IComponentWrapperArgs {
  hostSelector: string,
  nthOfType?: number, // to find the nth element within the 'scope'
  hostElement?: ElementHandle<HTMLElement>, // can be passed as a ref
  mountTimeout?: number,
  scopeElement?: ElementHandle<HTMLElement> | string,
}

type TWaitForOptions = Record<string, any>;

// @todo wrap child components automatically
export abstract class ComponentWrapper {
  /** ElementHandle of component's host element. */
  protected $host: ElementHandle<HTMLElement> | null = null;

  /** Host element selector. */
  private readonly hostSelector: string;

  /**
   * Promise which get resolved once host element of the component wrapper gets found.
   * One time use.
   */
  private readonly mountPromise: Promise<void>;

  protected constructor(args: IComponentWrapperArgs) {
    const {
      hostSelector,
      mountTimeout,
      scopeElement,
    } = args;

    // not sure if needed on 'this', not used as of now
    this.hostSelector = hostSelector;

    if (!scopeElement || isString(scopeElement)) {
      const scopeElementSelector = scopeElement as string || 'body';

      this.mountPromise = page.$(scopeElementSelector)
        // @ts-ignore
        .then(($scopeElement: ElementHandle) => {
          return this.setHostElement(
            $scopeElement as ElementHandle<HTMLElement>,
            hostSelector,
            mountTimeout,
          );
        });

      return;
    }

    const {
      hostElement,
      nthOfType,
    } = args;

    this.mountPromise = this.setHostElement(
      scopeElement,
      hostSelector,
      nthOfType,
      mountTimeout,
      hostElement,
    );
  }

  /**
   * Checks whether host element is "connected". Waits for mountPromise to get resolved.
   */
  public get isConnected(): Promise<boolean> {
    return this.isMounted
      .then(() => {
        return this.$host.evaluate((node: HTMLElement) => node.isConnected);
      });
  }

  /**
   * Returns a promise to be resolved with a true if element is hidden or gets hidden withing the
   * timeframe passed (or default timeframe if not) and false if it remains.
   */
  public waitForDisconnected(timeout?: number): Promise<boolean> {
    const options: TWaitForOptions = {};

    if (timeout) {
      options.timeout = timeout;
    }

    return this.$host.waitForElementState('hidden', options)
      .then(() => true)
      .catch(() => false);
  }

  /**
   * Returns promise which get resolved upon finding component wrapper's host element.
   */
  protected get isMounted(): Promise<void> {
    if (this.$host !== null) {
      return Promise.resolve();
    }

    return this.mountPromise;
  }

  /**
   * Returns ElementHandler for the element within the host element by selector.
   */
  protected getElementHandle(
    selector: string,
  ): Promise<ElementHandle | null> {
    const { $host } = this;

    if (!$host) {
      throw Error('Not mounted yet');
    }

    return $host.waitForSelector(selector);
  }

  /**
   * Return list of elements within host by the selector passed.
   */
  protected async getElements(
    selector: string,
  ): Promise<ElementHandle<HTMLElement>[]> {
    const { $host } = this;

    if (!$host) {
      throw Error('Not mounted yet');
    }

    // need this await cause it seems like $$ doesn't have an embedded timeout
    await $host.waitForSelector(selector);

    // figure out how to pass timeout here
    return $host.$$(selector) as Promise<ElementHandle<HTMLElement>[]>;
  }

  /**
   * Sets $host reference.
   */
  private setHostElement(
    scopeElement: ElementHandle<HTMLElement>,
    selector: string,
    nthOfType?: number,
    timeout?: number,
    hostElement?: ElementHandle<HTMLElement>,
  ): Promise<void> {
    const options: TWaitForOptions = {};

    if (hostElement) {
      this.$host = hostElement;

      return Promise.resolve();
    }

    if (timeout !== undefined) {
      options.timeout = timeout;
    }

    if (nthOfType !== undefined) {
      selector += ` >> nth=${nthOfType}`;
    }

    return scopeElement.waitForSelector(selector, options)
      .then(($elem: ElementHandle) => {
        this.$host = $elem as ElementHandle<HTMLElement>;
      });
  }
}
