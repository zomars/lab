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
  tag = '[data-testid*=PostTags-Tag]',
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

  public static async isTagLink($tag: ElementHandle): Promise<boolean> {
    const dataId = await $tag.getAttribute('data-testid');
    const dataIds = dataId.split(' ');

    return dataIds.includes('PostTags-Tag_link');
  }

  public getImage(): Promise<ElementHandle | null> {
    return this.getElementHandle(PostPreviewSelector.image);
  }

  public async getExcerptText(): Promise<string> {
    const $excerpt = await this.getElementHandle(PostPreviewSelector.excerpt);
    const text = await $excerpt.innerText();

    return text.trim();
  }

  public getTitle(): Promise<ElementHandle> {
    return this.getElementHandle(PostPreviewSelector.header);
  }

  public async getTitleText(): Promise<string> {
    const $title = await this.getTitle();
    const title = await $title.innerText();

    return title.trim();
  }

  public async getTags(): Promise<string[]> {
    const $elements = await this.getTagElements();

    const tags = $elements.map($element => $element.innerText());

    return Promise.all(tags)
      .then((tags: string[]) => tags.map(tag => tag.trim()));
  }

  public getTagElements(): Promise<ElementHandle[]> {
    return this.getElements(PostPreviewSelector.tag);
  }
}
