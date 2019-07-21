import React, { ReactElement } from 'react';

import { Layout } from '../../components/Layout';
import { SEO } from '../../components/seo';
import { cn } from '@bem-react/classname';
import { PostPreview } from '../PostPreview/PostPreview';

import './BlogIndex.scss';

const cnBlogIndex = cn('BlogIndex');

class BlogIndex extends React.Component {
  public render(): ReactElement {
    const { data } = this.props as any;
    const { shortTitle: siteTitle } = data.site.siteMetadata;
    const { edges: posts } = data.allMarkdownRemark;

    const postElems = posts.map(
      ({ node: post }: any) => (
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

export { BlogIndex };
