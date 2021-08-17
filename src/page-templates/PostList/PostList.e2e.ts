import {
  ComponentWrapper,
  IComponentWrapperArgs,
} from '../../../e2e-test/components/component-wrapper.e2e';
import { PostPreview } from '../../components/PostPreview/PostPreview.e2e';

enum PostListSelector {
  host = '[data-testid~=PostList]',
  postTag = 'data-testid=PostTags-Tag',
  post = '[data-testid~=PostList-PostPreview]',
}

export class PostList extends ComponentWrapper {
  constructor(args: Partial<IComponentWrapperArgs> = {}) {
    super({
      hostSelector: PostListSelector.host,
      ...args,
    });
  }

  /**
   * Return tag elements of all posts.
   * @todo: Reimplement with PostList e2e component
   */
  public async getAllPostsTags(): Promise<string[]> {
    const tags = [];
    const $tags = await this.getElements(PostListSelector.postTag);

    for (const $tag of $tags) {
      const label = await $tag.innerText();

      tags.push(
        label
          .replace('#', '')
          .trim(),
      );
    }

    return tags;
  }

  public async getAllPosts(): Promise<PostPreview[]> {
    const $posts = await this.getElements(PostListSelector.post);

    return $posts.map(($post) => {
      return new PostPreview({
        scopeElement: this.$host,
        hostElement: $post,
      });
    });
  }
}
