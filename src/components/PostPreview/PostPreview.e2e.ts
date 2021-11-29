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
  details = 'data-testid=PostPreview-Details',
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
    const $excerpt = await this.getExcerpt();
    const text = await $excerpt.innerText();

    return text.trim();
  }

  public getExcerpt(): Promise<ElementHandle<HTMLElement>> {
    return this.getElementHandle(PostPreviewSelector.excerpt);
  }

  public getTitle(): Promise<ElementHandle> {
    return this.getElementHandle(PostPreviewSelector.header);
  }

  public async getTitleText(): Promise<string> {
    const $title = await this.getTitle();
    const title = await $title.innerText();

    return title.trim();
  }

  public async getPostedDateText(): Promise<string> {
    const details = await this.getDetailsString();

    const parts = details.split('—');

    return parts[0].trim();
  }

  public async getPostReadTime(): Promise<string> {
    const details = await this.getDetailsString();

    const parts = details.split('—');

    return parts[1].trim();
  }

  private async getDetailsString(): Promise<string> {
    const $details = await this.getElementHandle(PostPreviewSelector.details);

    return $details.innerText();
  }
}
