import React, { ReactElement } from 'react';
import { each } from 'lodash';
import {
  getImage,
  getSrc,
  ImageDataLike,
} from 'gatsby-plugin-image';

import { useSiteMetadata } from '../../hooks/useSiteMetadata.hook';

interface IHeadMetaTag {
  property?: string;
  name?: string;
  content: string;
}

interface IHeadProps {
  title?: string;
  description?: string;
  meta?: IHeadMetaTag[];
  keywords?: string[];
  pathname?: string;
  image?: ImageDataLike;
  withCanonical?: boolean;
}

export function HtmlHead(props: IHeadProps): ReactElement {
  const siteMetadata = useSiteMetadata();

  const {
    description: propsDescription,
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

  const metaTags: IHeadMetaTag[] = [
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

  const linkTags = links.map(({ rel, href }) => (
    <link
      key = { rel }
      rel = { rel }
      href = { href }
    />
  ));

  const htmlMetaTags = metaTags.map(({ name, content, property }) => (
    <meta
      key = { name }
      name = { name }
      property = { property }
      content = { content }
    />
  ));

  return (
    <>
      <title>{ `${ title } | ${ siteMetadata.title }` }</title>
      { linkTags }
      { htmlMetaTags }
    </>
  );
}
