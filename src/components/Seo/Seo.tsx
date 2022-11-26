import React, { ReactElement } from 'react';
import {
  getImage,
  getSrc,
  ImageDataLike,
} from 'gatsby-plugin-image';
import { Helmet } from 'react-helmet';
import { useStaticQuery, graphql } from 'gatsby';
import { each } from 'lodash';

import { ISiteMetadata } from '../../types/common.types';

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

const useSiteMetadata = (): ISiteMetadata => {
  const { site } = useStaticQuery(detailsQuery);

  return site.siteMetadata;
};

interface IHelmetMetaTag {
  property?: string;
  name?: string;
  content: string;
}

interface ISeoProps {
  title?: string;
  description?: string;
  meta?: IHelmetMetaTag[];
  keywords?: string[];
  pathname?: string;
  image?: ImageDataLike;
  lang?: string;
  withCanonical?: boolean;
}

export function Seo(props: ISeoProps): ReactElement {
  const siteMetadata = useSiteMetadata();

  const {
    description: propsDescription,
    lang = 'en',
    meta,
    title: propsTitle,
    pathname,
    image,
    keywords,
    withCanonical,
  } = props;

  const description = propsDescription || siteMetadata.description;
  const title = propsTitle || siteMetadata.title;
  const { siteUrl } = siteMetadata;

  const attrs = { lang };

  // developer.twitter.com/en/docs/twitter-for-websites/cards/
  // overview/summary-card-with-large-image
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
    url: pathname ? `${ siteUrl }${ pathname }` : '',
  };

  const gatsbyImage = getImage(image || null);

  if (gatsbyImage) {
    const imgSrc = siteUrl + getSrc(gatsbyImage);

    twitterCard.image = imgSrc;
    twitterCard['image:width'] = gatsbyImage.width;
    twitterCard['image:height'] = gatsbyImage.width;

    fbCard.image = imgSrc;
    fbCard['image:width'] = gatsbyImage.width;
    fbCard['image:height'] = gatsbyImage.width;
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

  const links: Record<string, string>[] = [];

  if (withCanonical && pathname) {
    links.push({
      rel: 'canonical',
      href: `${ siteUrl }${ pathname }`,
    });
  }

  return (
    <Helmet
      title = { title }
      htmlAttributes = { attrs }
      titleTemplate = { `%s | ${ siteMetadata.title }` }
      meta = { metaTags }
      link = { links }
    />
  );
}
