const title = 'Alex Malitsky';
const shortTitle = 'AM';

const metadata = {
    title,
    shortTitle,
    author: `Alex Malitsky`,
    description: `We gonna figure what it is all about`,
    siteUrl: `https://amalitsky.com/`,
    social: {
        twitter: `amalitsky`
    }
};

const plugins = [
    {
        resolve: `gatsby-source-filesystem`,
        options: {
            path: `${__dirname}/content`,
            name: `blog`
        }
    }, {
        resolve: `gatsby-source-filesystem`,
        options: {
            path: `${__dirname}/content/assets`,
            name: `assets`
        }
    }, {
        resolve: `gatsby-transformer-remark`,
        options: {
            excerpt_separator: `<!-- end -->`,
            plugins: [
                {
                    resolve: `gatsby-remark-images`,
                    options: {
                        withWebp: true,
                        maxWidth: 1024,
                        quality: 75,
                    }
                },
                {
                    resolve: `gatsby-remark-responsive-iframe`,
                    options: {
                        wrapperStyle: `margin-bottom: 1.0725rem`
                    }
                },
                `gatsby-remark-prismjs`,
                `gatsby-remark-copy-linked-files`,
                `gatsby-remark-smartypants`
            ]
        }
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
        resolve: `gatsby-plugin-google-analytics`,
        options: {
            //trackingId: `ADD YOUR TRACKING ID HERE`,
        }
    },
    /*`gatsby-plugin-feed`, {
        resolve: `gatsby-plugin-manifest`,
        options: {
            name: title,
            short_name: shortTitle,
            start_url: `/`,
            background_color: `#ffffff`,
            theme_color: `#663399`,
            display: `minimal-ui`,
            icon: `content/assets/gatsby-icon.png`
        }
    },*/
    //`gatsby-plugin-offline`,
    `gatsby-plugin-react-helmet`,
    {
        resolve: `gatsby-plugin-typography`,
        options: {
            pathToConfigModule: `src/utils/typography`
        }
    },
    'gatsby-plugin-typescript',
    'gatsby-plugin-tslint',
    'gatsby-plugin-sass',
];

const config = {
    polyfill: false,
    siteMetadata: metadata,
    plugins
};

module.exports = config;
