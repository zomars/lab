import React, { ReactElement } from 'react';
import Helmet from 'react-helmet';
import { StaticQuery, graphql } from 'gatsby';

const detailsQuery = graphql`
  query DefaultSEOQuery {
    site {
      siteMetadata {
        title
        description
        author
      }
    }
  }
`;

interface ISeoProps {
  keywords?: string[],
  lang?: string,
  meta?: any[],
  description?: string,
  title?: string,
}

export class SEO extends React.Component<ISeoProps> {
  public render(): ReactElement {
    return (
      <StaticQuery
        query = { detailsQuery }
        render = { this.render_ }
      />
    );
  }

  private render_ = (data: any): ReactElement => {
    const {
      description,
      lang,
      meta,
      title,
      keywords,
    } = this.props;

    const metaDescription =
      description || data.site.siteMetadata.description;

    const attrs = { lang };

    const metaTags = [
      {
        content: metaDescription,
        name: 'description',
      }, {
        content: title,
        property: 'og:title',
      }, {
        content: metaDescription,
        property: 'og:description',
      }, {
        content: 'website',
        property: 'og:type',
      }, {
        content: 'summary',
        name: 'twitter:card',
      }, {
        content: data.site.siteMetadata.author,
        name: 'twitter:creator',
      }, {
        content: title,
        name: 'twitter:title',
      }, {
        content: metaDescription,
        name: 'twitter:description',
      },
    ];

    if (meta?.length) {
      metaTags.push(...meta);
    }

    if (keywords?.length) {
      metaTags.push({
        name: 'keywords',
        content: keywords.join(),
      });
    }

    return (
      <Helmet
        htmlAttributes = { attrs }
        title = { title }
        titleTemplate = { `%s | ${ data.site.siteMetadata.title }` }
        meta = { metaTags }
      />
    );
  };
}
