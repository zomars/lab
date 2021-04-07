import React, { HTMLAttributes, ReactElement } from 'react';

interface IHTMLPageProps {
  htmlAttributes: HTMLAttributes<unknown>,
  headComponents: ReactElement[],
  bodyAttributes: HTMLAttributes<unknown>,
  preBodyComponents: ReactElement[],
  body: string,
  postBodyComponents: ReactElement[],
}

function HTML(props: IHTMLPageProps): ReactElement {
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
          href = 'https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,700|Merriweather:700'
        />
        { props.headComponents }
      </head>
      <body { ...props.bodyAttributes }>
        { props.preBodyComponents }
        <div
          style = {{
            flex: 1,
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
