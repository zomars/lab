import { test, expect } from '@playwright/test';
import {
  from,
  count,
  identity,
  mergeMap,
  firstValueFrom,
  toArray,
} from 'rxjs';

import { BlogPost } from '../../page-templates/BlogPost/BlogPost.e2e';
import { ImageGrid } from './ImageGrid.e2e';

const postUrl = 'posts/2022/034-motorsport-summerfest/';
const expectedImageGridQ = 3;
const expectedImageQ = 13;

test.describe('ImageGrid', () => {
  let blogPost: BlogPost;

  test.beforeEach(async ({ page }) => {
    await page.goto(postUrl);

    blogPost = new BlogPost({ page });

    await expect(blogPost.isConnected).resolves.toBeTruthy();
  });

  test('post has expected number of imageGrids', async () => {
    const imageGrids = await blogPost.getImageGrids();

    expect(imageGrids.length).toEqual(expectedImageGridQ);
  });

  test('post has expected images', async ({ page }) => {
    const images$ = from(blogPost.getImageGrids())
      .pipe(
        mergeMap(identity),
        mergeMap((imageGridElement) => {
          const imageGrid = new ImageGrid({
            hostElement: imageGridElement,
            page,
          });

          return imageGrid.isConnected.then(() => imageGrid);
        }),
        mergeMap(imageGrid => imageGrid.getImages()),
        mergeMap(identity), // wait for promises to get resolved
      );

    const imagesQ$ = images$
      .pipe(
        count(),
      );

    const length = await firstValueFrom(imagesQ$);

    expect(length).toEqual(expectedImageQ);

    const snapshots$ = images$.pipe(
      mergeMap((imageHandle) => {
        return imageHandle.screenshot({ animations: 'disabled' });
      }),
      toArray(),
    );

    const snapshots = await firstValueFrom(snapshots$);

    snapshots.forEach(
      (snapshot, index) => {
        expect(snapshot).toMatchSnapshot(`grid-image-${ index }.png`);
      },
    );
  });

  test('shows image title on hover and make the image darker',
    async () => {
      const [imageGrid] = await blogPost.getImageGrids();

      await imageGrid.hover();

      const snapshot = await imageGrid.screenshot({ animations: 'disabled' });

      await expect(snapshot).toMatchSnapshot();
    });
});
