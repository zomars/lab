import {
  ComponentWrapper,
  IComponentWrapperArgs,
} from '../../../e2e-tests/components/component-wrapper.e2e';
import { PostPreview } from '../../components/PostPreview/PostPreview.e2e';

enum PostListSelector {
  host = '[data-testid~=PostList]',
  post = '[data-testid~=PostList-PostPreview]',
}

export class PostList extends ComponentWrapper {
  constructor(args: IComponentWrapperArgs) {
    super({
      hostSelector: PostListSelector.host,
      ...args,
    });
  }

  public async getAllPosts(): Promise<PostPreview[]> {
    const $posts = await this.getElements(PostListSelector.post);

    return $posts.map(($post) => {
      return new PostPreview({
        scopeElement: this.$host,
        hostElement: $post,
        page: this.$page,
      });
    });
  }
}
