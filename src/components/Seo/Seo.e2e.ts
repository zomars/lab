import { ElementHandle } from 'playwright';

import {
  ComponentWrapper,
  IComponentWrapperArgs,
  IElementHandleWaitForSelectorOptions,
} from '../../../e2e-tests/components/component-wrapper.e2e';

enum HeadSelector {
  host = 'head',
  title = 'title',
  twitterMetaTag = 'meta[name^="twitter:"]',
  fbMetaTag = 'meta[property^="og:"]',
  canonicalLink = 'link[rel=canonical]',
}

const waitForSelectorOptions: IElementHandleWaitForSelectorOptions = {
  state: 'attached', // these elements will never be visible
};

export class Head extends ComponentWrapper {
  constructor(args: IComponentWrapperArgs) {
    super({
      hostSelector: HeadSelector.host,
      scopeElement: 'html',
      waitForSelectorOptions,
      ...args,
    });
  }

  public async getTitle(): Promise<string> {
    const $title = await this.getElementHandle(HeadSelector.title, waitForSelectorOptions);

    return $title.innerText();
  }

  public getFbCardMetaTags(): Promise<ElementHandle<HTMLMetaElement>[]> {
    return this.getElements<HTMLMetaElement>(HeadSelector.fbMetaTag, waitForSelectorOptions);
  }

  public getTwitterCardMetaTags(): Promise<ElementHandle<HTMLMetaElement>[]> {
    return this.getElements<HTMLMetaElement>(HeadSelector.twitterMetaTag, waitForSelectorOptions);
  }

  public getCanonicalLinkHref(): Promise<string> {
    const link = this.$page.locator(HeadSelector.canonicalLink);

    return link.getAttribute('href');
  }
}
