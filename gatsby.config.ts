/**
 * @fileoverview
 *
 * Actual Gatsby config file (in TypeScript).
 */

const title = 'AM Labs';

const metadata = {
  title,
  author: 'Alex Malitsky',
  description: 'We gonna figure what it is all about',
  siteUrl: 'https://amalitsky.com/',
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
  'gatsby-transformer-sharp',
  'gatsby-plugin-sharp',
  'gatsby-plugin-image',
  'gatsby-remark-images',
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
            maxWidth: 2048,
            quality: 80,
          },
        },
        // 'gatsby-remark-prismjs',
        'gatsby-remark-reading-time',
      ],
    },
  },
  /* {
    resolve: 'gatsby-plugin-graphql-codegen',
    options: {
      fileName: 'graphql.types.ts',
      documentPaths: [
        './src/!**!/!*.{ts,tsx}',
        './node_modules/gatsby-*!/!**!/!*.js',
        './gatsby-node.ts',
      ]
    }
  } */
];

const config = {
  polyfill: false,
  siteMetadata: metadata,
  plugins,
};

// eslint-disable-next-line import/no-default-export
export default config;
