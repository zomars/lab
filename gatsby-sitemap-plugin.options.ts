const siteMapQuery = `{
  site {
    siteMetadata {
      siteUrl
    }
  }
  allPages: allSitePage {
    nodes {
      path
      context: pageContext
    }
  }
  allPosts: allMdx(
    filter: { frontmatter: { published: { ne: false } } }
    sort: { fields: [slug], order: DESC }
  ) {
    nodes {
      fields {
        path: slug
      }
      frontmatter {
        updated(formatString: "YYYY-MM-DD")
        date(formatString: "YYYY-MM-DD")
      }
    }
  }
}`;

interface ISitePage {
  path: string,
  context?: {
    updated?: string, // for now used for post list pages only
  }
}

interface IPostPage {
  fields: {
    path: string,
  },
  frontmatter: {
    date: string,
    updated?: string,
  },
}

interface ISitePageMeta {
  path: string,
  updated?: string,
}

/**
 * Create flat list of website pages.
 * Post pages go first and have exact creation/update timestamp.
 * For post listing pick up creation most recent post creation timestamp.
 */
function resolvePages({
  allPages: { nodes: allPages },
  allPosts: { nodes: allPosts },
}: {
  allPages: { nodes: ISitePage[] },
  allPosts: { nodes: IPostPage[] },
}): ISitePageMeta[] {
  const slugMap = new Set<string>();

  const pages: ISitePageMeta[] = allPosts.map((page) => {
    const {
      date,
      updated,
    } = page.frontmatter;

    const { path } = page.fields;

    slugMap.add(path);

    return {
      path,
      updated: updated || date,
    };
  });

  allPages.forEach(({ path, context }) => {
    if (!slugMap.has(path)) {
      pages.push({
        path,
        updated: context?.updated,
      });
    }
  });

  return pages;
}

/**
 * Convert resolvePages result into objects going into sitemap.xml file.
 */
function serialize(
  { path, updated }: ISitePageMeta
): Record<string, string | undefined> {
  return {
    url: path,
    lastmod: updated,
  };
}

export const options = {
  query: siteMapQuery,
  entryLimit: 10000,
  resolvePages,
  serialize,
};
