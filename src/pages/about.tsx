import React, {ReactElement} from 'react'
import Layout from '../components/Layout'
import Bio from '../components/Bio/Bio'

class AboutPage extends React.Component {
  public render(): ReactElement {
    return (
      <Layout
        location={(this.props as any).location}
      >
        <h1>About this blog and the author</h1>
        <Bio></Bio>
      </Layout>
    )
  }
}

export default AboutPage
