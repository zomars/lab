import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { StaticQuery, graphql } from 'gatsby';

function SEO({ description, lang, meta, keywords, title }) {
  return (
    <StaticQuery
      query={ detailsQuery }
      render={ data => {
        const metaDescription =
          description || data.site.siteMetadata.description;
        return (
          <Helmet
            htmlAttributes={ {
              lang,
            } }
            title={ title }
            titleTemplate={ `%s | ${ data.site.siteMetadata.title }` }
            meta={ [
              {
                content: metaDescription,
                name: `description`,
              },
              {
                content: title,
                property: `og:title`,
              },
              {
                content: metaDescription,
                property: `og:description`,
              },
              {
                content: `website`,
                property: `og:type`,
              },
              {
                content: `summary`,
                name: `twitter:card`,
              },
              {
                content: data.site.siteMetadata.author,
                name: `twitter:creator`,
              },
              {
                content: title,
                name: `twitter:title`,
              },
              {
                content: metaDescription,
                name: `twitter:description`,
              }
            ]
              .concat(
                keywords.length > 0
                  ? {
                    content: keywords.join(`, `),
                    name: `keywords`
                  }
                  : [],
              )
              .concat(meta) }
          />
        );
      } }
    />
  );
}

SEO.defaultProps = {
  keywords: [],
  lang: `en`,
  meta: [],
};

SEO.propTypes = {
  description: PropTypes.string,
  keywords: PropTypes.arrayOf(PropTypes.string),
  lang: PropTypes.string,
  meta: PropTypes.array,
  title: PropTypes.string.isRequired,
};

export { SEO };

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
