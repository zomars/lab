import React, { ReactElement } from 'react';
import { StaticQuery, graphql } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';
import './Bio.scss';
import { cn } from '@bem-react/classname';

const cnBio = cn('Bio')

class Bio extends React.Component {
    public render(): ReactElement {
        return (
            <StaticQuery
                query={ bioQuery }
                render={ this.render_ }
            />
        )
    }

    protected render_ = (data: any) => {
        const { author } = data.site.siteMetadata

        return (
            <div className={ `${cnBio()} ${this.props.className}` }>
                <GatsbyImage
                  className={ cnBio('Avatar') }
                  image={ data.avatar.childImageSharp.gatsbyImageData }
                  alt={ author }
                  imgStyle={{
                      borderRadius: '50%',
                  }}
                />
                <div
                  className={ cnBio('Text') }
                >
                    Made by <strong>{author}</strong> who lives and works in SF bay area building useful things.
                </div>
            </div>
        )
    }
}

const bioQuery = graphql`
  query BioQuery {
    avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
      childImageSharp {
        gatsbyImageData(width: 50)
      }
    }
    site {
      siteMetadata {
        author
      }
    }
  }
`

export default Bio
