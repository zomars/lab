import remarkGfm from 'remark-gfm';

import {
  options as sitemapPluginOptions,
} from './gatsby-sitemap-plugin.options';

/**
 * @fileoverview
 *
 * Actual Gatsby config file in TypeScript.
 */

const {
  NODE_ENV: env,
  pr_id: prId,
} = process.env;

// production
let hostname = 'lab.amalitsky.com';
let protocol = 'https';

if (prId) {
  hostname = `pr-${ prId }--amlab.netlify.app`;
} else if (env === 'development') {
  hostname = 'localhost:8000';
  protocol = 'http';
}

const metadata = {
  title: 'amlab',
  author: 'Alex Malitsky',
  description: 'Unique and detailed posts on tech and auto topics',
  siteUrl: `${ protocol }://${ hostname }`,
  social: {
    twitter: 'amalitsky',
  },
};

const mdxPluginConfig = {
  resolve: 'gatsby-plugin-mdx',
  options: {
    extensions: [
      '.md',
      '.mdx',
    ],
    mdxOptions: {
      remarkPlugins: [
        remarkGfm,
      ],
    },
    gatsbyRemarkPlugins: [
      {
        resolve: 'gatsby-remark-images',
        options: {
          withAvif: true,
          withWebp: true,
          maxWidth: 960,
          quality: 80,
          showCaptions: ['title'],
        },
      },
    ],
  },
};

const googleTagManagerPlugin = {
  resolve: 'gatsby-plugin-google-tagmanager',
  options: {
    id: 'GTM-KV3CGSG',
    includeInDevelopment: true,
    defaultDataLayer: {
      platform: 'gatsby',
    },
    routeChangeEventName: 'gatsby-route-change', // not used in GTM
    enableWebVitalsTracking: false,
  },
};

const plugins = [
  {
    resolve: 'gatsby-source-filesystem',
    options: {
      path: `${ __dirname }/content`,
      name: 'blog',
    },
  },
  'gatsby-plugin-material-ui',
  {
    resolve: 'gatsby-plugin-sharp',
    options: {
      defaults: {
        quality: 80,
        breakpoints: [
          300,
          460,
          920,
          1600,
        ],
        webpOptions: {
          quality: 80,
        },
      },
    },
  },
  'gatsby-plugin-image',
  'gatsby-plugin-sharp',
  'gatsby-transformer-sharp',
  'gatsby-plugin-preact',
  'gatsby-plugin-sass',
  'gatsby-plugin-split-css',
  mdxPluginConfig,
  googleTagManagerPlugin, {
    resolve: 'gatsby-plugin-sitemap',
    options: sitemapPluginOptions,
  }, {
    resolve: 'gatsby-plugin-robots-txt',
    options: {
      policy: [
        {
          userAgent: '*',
          allow: '/',
        },
      ],
    },
  },
];

const config = {
  polyfill: false,
  siteMetadata: metadata,
  plugins,
};

// eslint-disable-next-line import/no-default-export
export default config;
