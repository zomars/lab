const path = require('path');
const { createFilePath } = require('gatsby-source-filesystem');

const postsQuery = `
  {
    allMdx(
      sort: { fields: [frontmatter___date], order: DESC }
      limit: 1000
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
          }
        }
      }
    }
  }
`;

const blogPostPath = path.resolve('./src/templates/BlogPost/BlogPost.tsx');
const blogIndexPath = path.resolve('./src/components/BlogIndexPage.tsx');

const blogIndexPage = {
  path: '/blog/',
  component: blogIndexPath
};

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;

  // index page of /blog
  createPage(blogIndexPage);

  return graphql(postsQuery)
    .then(result => {
      if (result.errors) {
        throw result.errors;
      }

      // Create blog posts pages.
      const { edges: posts } = result.data.allMdx;

      posts.forEach((post, index) => {
        const previous = index === posts.length - 1 ? null : posts[index + 1].node;
        const next = index === 0 ? null : posts[index - 1].node;

        createPage({
          path: post.node.fields.slug,
          component: blogPostPath,
          context: {
            slug: post.node.fields.slug,
            previous,
            next
          }
        });
      });
    });
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === 'Mdx' || node.ext === '.md') {
    const value = createFilePath({
      node,
      getNode
    });

    createNodeField({
      name: `slug`,
      node,
      value
    });
  }
};
