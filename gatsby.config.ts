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
  hostname = `pr${ prId }--amlab.netlify.app`;
} else if (env === 'development') {
  hostname = 'localhost:8000';
  protocol = 'http';
}

const metadata = {
  title: 'Alex M Lab',
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
        breakpoints: [
          600,
          960,
          1280,
          1920,
        ],
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
  {
    resolve: 'gatsby-plugin-google-gtag',
    options: {
      trackingIds: [
        'G-6G7FL8W2JR',
      ],
      // This object gets passed directly to the gtag config command
      gtagConfig: {
        optimize_id: 'OPT_CONTAINER_ID',
        anonymize_ip: true,
        cookie_expires: 0,
      },
      // This object is used for configuration specific to this plugin
      pluginConfig: {
        // Puts tracking script in the head instead of the body
        head: false,
        // Setting this parameter is also optional
        respectDNT: true,
      },
    },
  }, {
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
