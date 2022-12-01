import { graphql, useStaticQuery } from 'gatsby';

import { ISiteMetadata } from '../types/common.types';

const detailsQuery = graphql`
  query UseSiteMetadata {
    site {
      siteMetadata {
        title
        siteUrl
        description
        author
        social {
          twitter
        }
      }
    }
  }
`;

export const useSiteMetadata = (): ISiteMetadata => {
  const { site } = useStaticQuery(detailsQuery);

  return site.siteMetadata;
};
