import { getItem, setItem } from '../services/local-storage';

export function useLocalStoragePostLike(postId: string): [
  () => boolean,
  (value: boolean) => void,
] {
  const propertyName = `blog-post-like-state-${ postId }`;

  function getPostLikeFromStorage(): boolean {
    if (!postId) {
      throw Error('can\'t get post like value for an empty postId');
    }

    return typeof window !== 'undefined' ? !!getItem(propertyName) : false;
  }

  function setPostLikeToStorage(value: boolean): void {
    if (!postId) {
      throw Error('can\'t set post like value for an empty postId');
    }

    setItem(propertyName, value ? 'true' : '');
  }

  return [
    getPostLikeFromStorage,
    setPostLikeToStorage,
  ];
}
