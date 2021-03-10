import React, { ReactElement } from 'react';
import { Link } from 'gatsby';
import { Styled } from 'theme-ui';
import { cn } from '@bem-react/classname';

const classnames = require('classnames');

import './PostPreview.scss';

const cnPostPreview = cn('PostPreview');

export class PostPreview extends React.Component {
  public render(): ReactElement {
    const {
      post,
      className
    } = this.props as any;
    const { slug: id } = post.fields;
    const title = post.frontmatter.title || id;

    const dateHtml =
      `<Styled.span class="${ cnPostPreview('Date') }">` +
        `${ post.frontmatter.date }` +
      '</Styled.span>';

    const excerptHtml = `${ dateHtml } &mdash; ${ post.excerpt }`;

    return (
      <Styled.div
        className = { classnames(cnPostPreview(), className) }>
        <Styled.h3 className = { cnPostPreview('Header') }>
          <Styled.a as={Link}
            to = { id }>
            { title }
          </Styled.a>
        </Styled.h3>
        <Styled.p dangerouslySetInnerHTML = { { __html: excerptHtml } }/>
        <Styled.div className = { cnPostPreview('ReadMore') }>
          <Styled.a as={Link} to = { id }>&rarr;</Styled.a>
        </Styled.div>
      </Styled.div>
    );
  }
}
