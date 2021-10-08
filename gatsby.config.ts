import {
  options as sitemapPluginOptions,
} from './gatsby-sitemap-plugin.options';

/**
 * @fileoverview
 *
 * Actual Gatsby config file (in TypeScript).
 */

const metadata = {
  title: 'Alex M Lab',
  author: 'Alex Malitsky',
  description: 'We gonna figure what it is all about',
  siteUrl: 'https://lab.amalitsky.com/',
  social: {
    twitter: 'amalitsky',
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
  'gatsby-remark-images',
  'gatsby-transformer-sharp',
  'gatsby-plugin-preact',
  // 'gatsby-plugin-feed',
  /* {
    resolve: 'gatsby-plugin-google-analytics',
    options: {
      trackingId: 'ADD YOUR TRACKING ID HERE',
    }
  }, */
  /* {
      resolve: 'gatsby-plugin-manifest',
      options: {
          name: title,
          start_url: '/',
          background_color: '#ffffff',
          theme_color: '#663399',
          display: 'minimal-ui',
          icon: 'content/assets/gatsby-icon.png'
      }
  },*/
  // 'gatsby-plugin-offline',
  'gatsby-plugin-react-helmet',
  'gatsby-plugin-mdx',
  'gatsby-plugin-typescript',
  'gatsby-plugin-sass',
  'gatsby-plugin-sharp',
  'gatsby-remark-reading-time',
  {
    resolve: 'gatsby-plugin-mdx',
    options: {
      extensions: ['.md', '.mdx'],
      gatsbyRemarkPlugins: [
        {
          resolve: 'gatsby-remark-images',
          options: {
            withAvif: true,
            withWebp: true,
            maxWidth: 650,
            quality: 80,
            showCaptions: ['title'],
          },
        },
        // 'gatsby-remark-prismjs',
        'gatsby-remark-reading-time',
      ],
    },
  }, {
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
