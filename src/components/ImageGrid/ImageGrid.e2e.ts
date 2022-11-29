import { ElementHandle } from 'playwright';
import {
  ComponentWrapper,
  IComponentWrapperArgs,
} from '../../../e2e-tests/components/component-wrapper.e2e';

export enum ImageGridSelector {
  host = '[data-testid=ImageGrid]',
  image = 'picture img',
}

export class ImageGrid extends ComponentWrapper {
  constructor(args: IComponentWrapperArgs) {
    super({
      hostSelector: ImageGridSelector.host,
      ...args,
    });
  }

  public getImages(): Promise<ElementHandle<HTMLPictureElement>[]> {
    return this.getElements(ImageGridSelector.image);
  }
}
