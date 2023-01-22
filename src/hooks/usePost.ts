import { useContext } from 'react';
import {
  IPostContext,
  PostContext,
  PostDispatchContext,
  TPostContextAction,
} from '../react-contexts/post.context';

export function usePost(): IPostContext | null {
  return useContext(PostContext);
}

export function usePostDispatch(): (action: TPostContextAction) => void {
  return useContext(PostDispatchContext);
}
