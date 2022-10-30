import React from 'react';

import { IBlogPost } from '../types/common.types';

export interface IPostContext {
  posts: Map<string, IBlogPost>;
  postsPerTag: Map<string, IBlogPost[]>;
}

const defaultValue: IPostContext = {
  posts: new Map<string, IBlogPost>(),
  postsPerTag: new Map<string, IBlogPost[]>(),
};

export const postsListContext = React.createContext(defaultValue);

postsListContext.displayName = 'PostListPerTagContext';
