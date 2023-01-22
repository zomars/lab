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

export const postListContext = React.createContext(defaultValue);

postListContext.displayName = 'PostListContext';
