import { Node } from 'gatsby';
import { ImageDataLike } from 'gatsby-plugin-image/dist/src/components/hooks';

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
  coverImage?: ImageDataLike,
  published?: boolean,
  updated?: string,
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
