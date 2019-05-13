import React, { ReactElement } from 'react'
import { Link } from 'gatsby'
import Image from 'gatsby-image'
import './Layout.scss'
import { cn } from '@bem-react/classname'
import { Header } from './Header/Header'

const className = cn('Layout')

class Layout extends React.Component {

  public render(): ReactElement {
    const { children, location } = this.props as any

    return (
      <div className={className()}>
        <Header
          className={className('Header')}
          location={location}
        />
        <div
          className={className('View')}
        >
          {children}
        </div>
        <footer
          className={className('Footer')}
        >
          <div className={className('Footer-Border')}/>
          {/*© {new Date().getFullYear()}, Built with
          {` `}
          <a href = 'https://www.gatsbyjs.org'>Gatsby</a>*/}
        </footer>
      </div>
    )
  }
}

export default Layout
