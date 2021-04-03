import { Node } from 'gatsby';

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
