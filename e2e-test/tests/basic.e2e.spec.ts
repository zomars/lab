import { PostList } from '../../src/page-templates/PostList/PostList.e2e';
import { IGlobal } from '../e2e.types';

const localGlobal = global as IGlobal & typeof globalThis;

describe('basics', () => {
  beforeEach(async () => {
    await jestPlaywright.resetContext();

    context.setDefaultTimeout(localGlobal.defaultTimeout);

    await page.goto(localGlobal.url);
  });

  it('has list of posts', async () => {
    const techPostsList = new PostList();

    await techPostsList.isConnected;

    const posts = await techPostsList.getAllPosts();

    expect(posts.length).toBeGreaterThanOrEqual(3);

    for (const post of posts) {
      const title = await post.getTitle();
      const excerpt = await post.getExcerptText();

      // lousy tests but don't want to hardcode content here
      // because it would have to be updated with every post
      expect(title).not.toBe('');
      expect(excerpt).not.toBe('');
    }
  });
});
