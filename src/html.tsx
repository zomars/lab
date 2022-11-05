import React, {
  HTMLAttributes,
  ReactElement,
} from 'react';

interface IHTMLPageProps {
  htmlAttributes: HTMLAttributes<any>;
  headComponents: ReactElement[];
  bodyAttributes: HTMLAttributes<any>;
  preBodyComponents: ReactElement[];
  body: string;
  postBodyComponents: ReactElement[];
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
