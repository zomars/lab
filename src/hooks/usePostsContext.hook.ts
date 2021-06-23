import { useContext } from 'react';
import { postsContext } from '../react-contexts/posts.context';
import { IBlogPost } from '../types/common.types';

/**
 * Return posts before and after the slug passed.
 * Takes tag into account.
 */
export function useAdjacentPosts(
  slug: string,
  tag: string,
): [
  IBlogPost | null,
  IBlogPost | null,
  // eslint-disable-next-line @typescript-eslint/indent
] {
  const {
    postsPerTag: postsPerTagMap,
  } = useContext(postsContext);

  const postsPerTag: IBlogPost[] = postsPerTagMap.get(tag) as IBlogPost[];

  const currentPostIndex = postsPerTag
    .findIndex(post => post.fields.slug === slug);

  const previousPost = currentPostIndex > 0 ?
    postsPerTag[currentPostIndex - 1] : null;

  const nextPostIndex = currentPostIndex + 1;

  const nextPost = nextPostIndex < postsPerTag.length ?
    postsPerTag[nextPostIndex] : null;

  return [
    previousPost,
    nextPost,
  ];
}
