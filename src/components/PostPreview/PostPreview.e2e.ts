import { ElementHandle } from 'playwright';

import {
  ComponentWrapper,
  IComponentWrapperArgs,
} from '../../../e2e-test/components/component-wrapper.e2e';

enum PostPreviewSelector {
  host = '[data-testid*=PostPreview]',
  hostWithImage = '[data-testid*=PostPreview_withImage]',
  image = 'data-testid=PostPreview-Image',
  excerpt = 'data-testid=PostPreview-Excerpt',
  readMore = 'data-testid=PostPreview-ReadMore',
  header = 'data-testid=PostPreview-Header',
}

interface IPostPreviewArgs extends Partial<IComponentWrapperArgs> {
  withPreview?: boolean;
}

export class PostPreview extends ComponentWrapper {
  constructor(args: IPostPreviewArgs = {}) {
    super({
      hostSelector: args.withPreview ? PostPreviewSelector.hostWithImage : PostPreviewSelector.host,
      ...args,
    });
  }

  public getImage(): Promise<ElementHandle | null> {
    return this.getElementHandle(PostPreviewSelector.image);
  }

  public async getExcerptText(): Promise<string> {
    const $excerpt = await this.getElementHandle(PostPreviewSelector.excerpt);

    return $excerpt.innerText();
  }

  public getTitle(): Promise<ElementHandle> {
    return this.getElementHandle(PostPreviewSelector.header);
  }

  public async getTitleText(): Promise<string> {
    const $title = await this.getTitle();

    return $title.innerText();
  }

  public getReadMore(): Promise<ElementHandle> {
    return this.getElementHandle(PostPreviewSelector.readMore);
  }
}
