import { WindowLocation } from '@reach/router';
import { Node } from 'gatsby';
import { ImageDataLike } from 'gatsby-plugin-image';
import { ReactNode } from 'react';

export interface INodeFields {
  [key: string]: unknown;
}

interface INode extends Node {
  fields: INodeFields;
}

export interface IPostEventDetails {
  date: string;
  locationName: string;
  locationAddress: string;
}

interface IBlogPostFrontmatter {
  title: string;
  date: string;
  tags: string[];
  coverImage?: {
    childImageSharp: ImageDataLike;
  };
  published?: boolean;
  updated?: string;
  summary?: string & ReactNode;
  description: string;
  galleryImages: unknown[];
  event: IPostEventDetails;
}

interface IReadingTime {
  text: string;
  words: number;
}

interface IBlogPostFields extends INodeFields {
  slug: string;
  readingTime: IReadingTime;
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

  social: {
    twitter: string;
  };
}

export interface IReactNodeProps {
  children?: string | ReactNode;
}

export interface IStateChangeEventDetails {
  location: WindowLocation;
}

export interface IGTagManager {
  dataLayer: [unknown];
  ga_debug_mode: true | undefined; // read by GTM GA4 Config
}

export function isWindowWithGTagManager(
  window: Window | Window & IGTagManager,
): window is (Window & IGTagManager) {
  return 'dataLayer' in window && Array.isArray(window.dataLayer);
}
