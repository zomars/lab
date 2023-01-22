import React from 'react';

export interface IPostContext {
  path: string;
  title: string;
  liked: boolean;
  description?: string; // meta tag
}

interface IPostSetAction {
  type: 'set';
  post: IPostContext;
}

interface IPostUnsetAction {
  type: 'unset';
}

interface IPostLikeAction {
  type: 'like';
  value: boolean; // allowing `true` and `false` for debugging only
}

export type TPostContextAction = IPostLikeAction | IPostUnsetAction | IPostSetAction;

export const PostContext = React.createContext<IPostContext | null>(null);

PostContext.displayName = 'PostListPerTagContext';

export const PostDispatchContext =
  React.createContext<(action: TPostContextAction) => void>(() => undefined);

PostDispatchContext.displayName = 'PostDispatchContext';

export function postContextReducer(
  post: IPostContext | null,
  action: TPostContextAction,
): IPostContext | null {
  switch (action.type) {
    case 'set':
      return action.post;

    case 'unset':
      return null;

    case 'like':
      if (!post) {
        throw Error('Can\'t like unset post');
      }

      return {
        ...post,
        liked: action.value,
      };
  }
}
