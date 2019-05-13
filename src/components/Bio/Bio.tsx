import React, {ReactElement} from 'react'
import { StaticQuery, graphql } from 'gatsby'
import Image from 'gatsby-image'
import './Bio.scss'
import { cn } from '@bem-react/classname'

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
                <Image
                  className={ cnBio('Avatar') }
                  fixed={ data.avatar.childImageSharp.fixed }
                  alt={ author }
                  imgStyle={{
                      borderRadius: `50%`,
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
        fixed(width: 50, height: 50) {
          ...GatsbyImageSharpFixed
        }
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
