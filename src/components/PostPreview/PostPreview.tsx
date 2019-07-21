import React, { ReactElement } from 'react';
import { Link } from 'gatsby';
import { cn } from '@bem-react/classname';

const classnames = require('classnames');

import './PostPreview.scss';

const cnPostPreview = cn('PostPreview');

class PostPreview extends React.Component {
  public render(): ReactElement {
    const {
      post,
      className
    } = this.props as any;
    const { slug: id } = post.fields;
    const title = post.frontmatter.title || id;

    const dateHtml =
      `<span class="${ cnPostPreview('Date') }">` +
        `${ post.frontmatter.date }` +
      '</span>';

    const excerptHtml = `${ dateHtml } &mdash; ${ post.excerpt }`;

    return (
      <div
        className = { classnames(cnPostPreview(), className) }>
        <h3 className = { cnPostPreview('Header') }>
          <Link
            to = { id }>
            { title }
          </Link>
        </h3>
        <p dangerouslySetInnerHTML = { { __html: excerptHtml } }/>
        <div className = { cnPostPreview('ReadMore') }>
          <Link to = { id }>&rarr;</Link>
        </div>
      </div>
    );
  }
}

export { PostPreview };
