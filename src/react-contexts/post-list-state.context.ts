import React from 'react';

import { IBlogPost } from '../types/common.types';

export interface IPostListContext {
  posts: Map<string, IBlogPost>;
  postsPerTag: Map<string, IBlogPost[]>;
}

const defaultValue: IPostListContext = {
  posts: new Map<string, IBlogPost>(),
  postsPerTag: new Map<string, IBlogPost[]>(),
};

export const PostListContext = React.createContext(defaultValue);

PostListContext.displayName = 'PostListContext';
