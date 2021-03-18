import { Node } from 'gatsby';

export interface INodeFields {
  slug: string,
  [key: string]: unknown,
}

export interface INode extends Node {
  fields: INodeFields;
}
