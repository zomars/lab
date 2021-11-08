import React, { ReactElement } from 'react';
import { Helmet } from 'react-helmet';
import { StaticQuery, graphql } from 'gatsby';
import { each } from 'lodash';

import { ISiteMetadata } from '../types/common.types';

const detailsQuery = graphql`
  query DefaultSEOQuery {
    site {
      siteMetadata {
        title
        description
        author
        siteUrl
      }
    }
  }
`;

interface IHelmetMetaTag {
  property?: string;
  name?: string;
  content: string;
}

interface ISeoProps {
  keywords?: string[],
  lang?: string,
  meta?: IHelmetMetaTag[],
  description?: string,
  title?: string,
  pathname?: string,
  image?: { src: string },
}

function render(
  props: ISeoProps,
  siteMetadata: ISiteMetadata,
): ReactElement {
  const {
    description: propsDescription,
    lang,
    meta,
    title: propsTitle,
    pathname,
    image,
    keywords,
  } = props;

  const description = propsDescription || siteMetadata.description;
  const title = propsTitle || siteMetadata.title;

  const attrs = { lang };

  // developer.twitter.com/en/docs/twitter-for-websites/cards/overview/summary-card-with-large-image
  const twitterCard = {
    card: image ? 'summary_large_image' : 'summary',
    site: '@amalitsky',
    creator: siteMetadata.author,
    title,
    image: '',
    // @todo: add image alt
    description,
  };

  // developers.facebook.com/docs/sharing/webmasters#markup
  const fbCard = {
    type: 'website',
    title,
    description,
    image: '',
    url: pathname ? siteMetadata.siteUrl + pathname : '',
  };

  if (image) {
    const imgSrc = siteMetadata.siteUrl + image.src;

    twitterCard.image = imgSrc;
    fbCard.image = imgSrc;
  }

  const metaTags: IHelmetMetaTag[] = [
    {
      name: 'description',
      content: description,
    },
  ];

  each(twitterCard, (value: string, propName: string): void => {
    if (value === '') {
      return;
    }

    const tag = {
      name: `twitter:${ propName }`,
      content: value,
    };

    metaTags.push(tag);
  });

  each(fbCard, (value: string, propName: string): void => {
    if (value === '') {
      return;
    }

    const tag = {
      property: `og:${ propName }`,
      content: value,
    };

    metaTags.push(tag);
  });

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
