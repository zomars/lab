import React, { ReactElement } from 'react';
import Helmet from 'react-helmet';
import { StaticQuery, graphql } from 'gatsby';

import { ISiteMetadata } from '../types/common.types';

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

/* eslint-disable react/no-unused-prop-types */

interface ISeoProps {
  keywords?: string[],
  lang?: string,
  meta?: IHelmetMetaTag[],
  description?: string,
  title?: string,
}

interface IHelmetMetaTag {
  content: string;
  name: string;
}

function render(
  props: ISeoProps,
  siteMetadata: ISiteMetadata,
): ReactElement {
  const {
    description,
    lang,
    meta,
    title,
    keywords,
  } = props;

  const metaDescription = description || siteMetadata.description;

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
      content: siteMetadata.author,
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
      titleTemplate = { `%s | ${ siteMetadata.title }` }
      meta = { metaTags }
    />
  );
}

export function Seo(props: ISeoProps): ReactElement {
  return (
    <StaticQuery
      query = { detailsQuery }
      render = {
        (data: { site: { siteMetadata: ISiteMetadata }}) => render(props, data.site.siteMetadata)
      }
    />
  );
}
