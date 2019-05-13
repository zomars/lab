import React, { ReactElement } from 'react'
import { graphql, Link, StaticQuery } from 'gatsby'
import { cn } from '@bem-react/classname'
const cnHeader = cn('Header')

import './Header.scss'

const topSections = [
  {name: 'Blog', path: '/blog'},
  // {name: 'Projects', path: '/projects'},
  {name: 'About', path: '/about'},
]

class Header extends React.Component {
  public render(): ReactElement {
    return (
      <StaticQuery
        query={pageQuery}
        render={this.render_}
      />
    )
  }

  protected render_ = (data: any): ReactElement => {
    const { location, className } = this.props as any
    const rootPath = `${process.env.__PATH_PREFIX__}/`
    const fullClassName = `${cnHeader()} ${className}`
    const { shortTitle } = data.site.siteMetadata

    return (
      <header
        className={fullClassName}
      >
        <ul>
          {this.getTopMenuList_()}
        </ul>
        <div
          className={cnHeader('Logo')}>
          <Link
            className={cnHeader('Link')}
            to={`/`}>
            { shortTitle }
          </Link>
        </div>
      </header>
    )
  }

  protected getTopMenuList_(): ReactElement[] {
    const { location } = this.props as any
    const { pathname } = location

    return topSections.map(({ name, path }: any) => {
        const activeState = path === pathname || path === '/blog' && pathname.indexOf(path) === 0

        return (
          <li
            key={name}
            className={ cnHeader('Link-Wrapper', {active: activeState})}
          >
            <Link
              className={ cnHeader('Link') }
              activeClassName={ cnHeader('Link', { active: true })}
              to={ path }>
              { name }
            </Link>
          </li>
        )
      })
  }
}

export { Header }

export const pageQuery = graphql`
  query PageQuery {
    site {
      siteMetadata {
        shortTitle
      }
    }
  }
`
