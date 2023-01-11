import { ElementHandle } from '@playwright/test';
import {
  ComponentWrapper,
  IComponentWrapperArgs,
} from '../../../e2e-tests/components/component-wrapper.e2e';
import { getElementHandleAttributes, getElementHandleInnerTexts } from '../../../e2e-tests/utils';

import { ImageGridSelector } from '../../components/ImageGrid/ImageGrid.e2e';

enum BlogPostSelector {
  host = '[data-testid~=Post]',
  tag = '[data-testid~=PostTags-Tag]',
  body = '[data-testid=Post-Body]',
  title = '[data-testid=Post-Title]',
  image = 'img',
}

export class Post extends ComponentWrapper {
  constructor(args: IComponentWrapperArgs) {
    super({
      hostSelector: BlogPostSelector.host,
      ...args,
    });
  }

  public async getTitle(): Promise<string> {
    const $title = await this.getElementHandle(BlogPostSelector.title);

    return $title.innerText();
  }

  public async getTags(): Promise<string[]> {
    const $tags = await this.getElements(BlogPostSelector.tag);

    const tags = await getElementHandleInnerTexts($tags);

    return tags.map(tag => tag.slice(1));
  }

  public async getBodyAsText(): Promise<string> {
    const $body = await this.getElementHandle(BlogPostSelector.body);

    return $body.innerText();
  }

  public async getHeaders(): Promise<string[]> {
    const $headers = await this.getElements('h1, h2, h3, h4, h5, h6');

    return getElementHandleInnerTexts($headers);
  }

  public async getImageTitles(): Promise<string[]> {
    const $images = await this.getElements(BlogPostSelector.image);

    return getElementHandleAttributes($images, 'alt');
  }

  public getImageGrids(): Promise<ElementHandle<HTMLElement>[]> {
    return this.getElements(ImageGridSelector.host);
  }
}
