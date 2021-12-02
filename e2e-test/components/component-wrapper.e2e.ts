import { ElementHandle } from 'playwright';
import { isString } from 'lodash';

export interface IElementHandleWaitForSelectorOptions {
  state?: 'attached' | 'detached' | 'visible' | 'hidden';
  strict?: boolean;
  timeout?: number;
}

export interface IComponentWrapperArgs {
  hostSelector: string,
  nthOfType?: number, // to find the nth element within the 'scope'
  hostElement?: ElementHandle<HTMLElement>, // can be passed as a ref
  scopeElement?: ElementHandle<HTMLElement> | string,
  waitForSelectorOptions?: IElementHandleWaitForSelectorOptions,
}

interface ISetHostElementArgs {
  scopeElement: ElementHandle<HTMLElement>,
  hostSelector?: string,
  nthOfType?: number,
  waitForSelectorOptions?: IElementHandleWaitForSelectorOptions,
  hostElement?: ElementHandle<HTMLElement>,
}

// @todo wrap child components automatically
export abstract class ComponentWrapper {
  /** ElementHandle of component's host element. */
  protected $host: ElementHandle<HTMLElement> | null = null;

  /**
   * Promise which get resolved once host element of the component wrapper gets found.
   * One time use.
   */
  private readonly mountPromise: Promise<void>;

  protected constructor(args: IComponentWrapperArgs) {
    const {
      hostSelector,
      waitForSelectorOptions,
      hostElement,
      scopeElement,
      nthOfType,
    } = args;

    let scopeElementPromise;

    if (!scopeElement || isString(scopeElement)) {
      const scopeElementSelector = scopeElement as string || 'body';

      scopeElementPromise = page.$(scopeElementSelector);
    } else {
      scopeElementPromise = Promise.resolve(scopeElement);
    }

    this.mountPromise = scopeElementPromise
      .then(($scopeElement) => {
        return this.setHostElement({
          scopeElement: $scopeElement as ElementHandle<HTMLElement>,
          waitForSelectorOptions,
          hostSelector,
          hostElement,
          nthOfType,
        });
      });
  }

  /**
   * Checks whether host element is 'connected'. Waits for mountPromise to get resolved.
   */
  public get isConnected(): Promise<boolean> {
    return this.isMounted
      .then(() => {
        return this.$host.evaluate((node: HTMLElement) => node.isConnected);
      });
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
   * Returns a promise to be resolved with a true if element is hidden or gets hidden withing the
   * timeframe passed (or default timeframe if not) and false if it remains.
   */
  public waitForDisconnected(timeout?: number): Promise<boolean> {
    const options: IElementHandleWaitForSelectorOptions = {};

    if (timeout) {
      options.timeout = timeout;
    }

    return this.$host.waitForElementState('hidden', options)
      .then(() => true)
      .catch(() => false);
  }

  /**
   * Returns ElementHandler for the element within the host element by selector.
   */
  protected getElementHandle<T extends HTMLElement = HTMLElement>(
    selector: string,
    options?: IElementHandleWaitForSelectorOptions,
  ): Promise<ElementHandle<T> | null> {
    const { $host } = this;

    if (!$host) {
      throw Error('Not mounted yet');
    }

    return $host.waitForSelector(selector, options) as unknown as Promise<ElementHandle<T> | null>;
  }

  /**
   * Return list of elements within host by the selector passed.
   */
  protected async getElements<T extends HTMLElement = HTMLElement>(
    selector: string,
    options?: IElementHandleWaitForSelectorOptions,
  ): Promise<ElementHandle<T>[]> {
    const { $host } = this;

    if (!$host) {
      throw Error('Not mounted yet');
    }

    // need this await cause it seems like $$ doesn't have an embedded timeout
    await $host.waitForSelector(selector, options);

    // figure out how to pass timeout here
    return $host.$$(selector) as unknown as Promise<ElementHandle<T>[]>;
  }

  /**
   * Sets $host reference.
   */
  private setHostElement(args: ISetHostElementArgs): Promise<void> {
    const { hostElement } = args;

    if (hostElement) {
      this.$host = hostElement;

      return Promise.resolve();
    }

    const {
      scopeElement,
      nthOfType,
      waitForSelectorOptions,
    } = args;

    let { hostSelector } = args;

    if (nthOfType !== undefined) {
      hostSelector += ` >> nth=${nthOfType}`;
    }

    return scopeElement.waitForSelector(hostSelector, waitForSelectorOptions)
      .then(($elem: ElementHandle) => {
        this.$host = $elem as ElementHandle<HTMLElement>;
      });
  }
}
