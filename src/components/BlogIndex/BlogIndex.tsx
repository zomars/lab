import React, { ReactElement } from 'react';

import { Layout } from '../Layout';
import { SEO } from '../seo';
import { cn } from '@bem-react/classname';
import { PostPreview } from '../PostPreview/PostPreview';

import './BlogIndex.scss';
import { INode } from '../../types/gatsby-node'

const cnBlogIndex = cn('BlogIndex');

export class BlogIndex extends React.Component<{ location: string }> {
  public render(): ReactElement {
    const { data } = this.props as any;
    const { title: siteTitle } = data.site.siteMetadata;
    const { nodes: posts } = data.allMdx;

    const postElems = posts.map(
      (post: INode) => (
        <PostPreview
          post = { post }
          key = { post.fields.slug }
          className = { cnBlogIndex('PostPreview') }/>
        )
    );

    const keywords = [
      'blog',
      'gatsby',
      'javascript',
      'react'
    ];

    return (
      <Layout
        location = { this.props.location }
        title = { siteTitle }
        className = { cnBlogIndex() }
      >
        <SEO
          title = 'All posts'
          keywords = { keywords }
        />
        { postElems }
      </Layout>
    );
  }
}
