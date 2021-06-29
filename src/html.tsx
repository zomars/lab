/** @jsx h */

import { h, VNode, Attributes } from 'preact';

interface IHTMLPageProps {
  htmlAttributes: Attributes,
  headComponents: VNode[],
  bodyAttributes: Attributes,
  preBodyComponents: VNode[],
  body: string,
  postBodyComponents: VNode[],
}

function HTML(props: IHTMLPageProps): VNode {
  return (
    <html { ...props.htmlAttributes }>
      <head>
        <meta charSet = 'utf-8'/>
        <meta
          httpEquiv = 'x-ua-compatible'
          content = 'ie=edge'
        />
        <meta
          name = 'viewport'
          content = 'width=device-width, initial-scale=1, shrink-to-fit=no'
        />
        <link
          rel = 'stylesheet'
          href = 'https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,500,600,700|Merriweather:700'
        />
        <link
          rel = 'stylesheet'
          href = 'https://fonts.googleapis.com/icon?family=Material+Icons'
        />
        { props.headComponents }
      </head>
      <body { ...props.bodyAttributes }>
        { props.preBodyComponents }
        <div
          style = {{
            flexGrow: 1,
          }}
          key = 'body'
          id = '___gatsby'
          dangerouslySetInnerHTML = {{ __html: props.body }}
        />
        { props.postBodyComponents }
      </body>
    </html>
  );
}

// eslint-disable-next-line import/no-default-export
export default HTML;
