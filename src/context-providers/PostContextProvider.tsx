import React, {
  ReactElement,
  useReducer,
} from 'react';

import {
  PostDispatchContext,
  PostContext,
  postContextReducer,
} from '../react-contexts/post.context';

export function PostContextProvider(
  { children }: { children: ReactElement },
): ReactElement {
  const [context, dispatch] = useReducer(postContextReducer, null);

  return (
    <PostContext.Provider
      value = { context }
    >
      <PostDispatchContext.Provider
        value = { dispatch }
      >
        { children }
      </PostDispatchContext.Provider>
    </PostContext.Provider>
  );
}
