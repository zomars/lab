import { Node } from 'gatsby';
import { ReactNode } from 'react';
import { ImageDataLike } from 'gatsby-plugin-image';

export interface INodeFields {
  [key: string]: unknown,
}

interface INode extends Node {
  fields: INodeFields;
}

interface IBlogPostFrontmatter {
  title: string,
  date: string,
  tags: string[],
  coverImage?: {
    childImageSharp: ImageDataLike,
  },
  published?: boolean,
  updated?: string,
  summary?: string & ReactNode,
  description: string,
}

interface IReadingTime {
  text: string,
  words: number,
}

interface IBlogPostFields extends INodeFields {
  slug: string,
  readingTime: IReadingTime,
}

export interface IBlogPost extends INode {
  frontmatter: IBlogPostFrontmatter;
  fields: IBlogPostFields;
  excerpt?: string;
  body?: string;
}

export interface IUniquePostTag {
  name: string;
  count: number;
}

export interface ISiteMetadata {
  title: string;
  description: string;
  author: string;
  siteUrl: string;
}

export interface IReactNodeProps {
  children: string | ReactNode;
}

export interface IPostTagsMappingQResponse {
  allPosts: {
    posts: IBlogPost[],
  },
  uniqueTags: {
    tags: IUniquePostTag[],
  },
}
