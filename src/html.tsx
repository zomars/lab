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

const googleApiHostname = 'https://fonts.googleapis.com';

const fontPaths = [
  'css?family=Source+Sans+Pro:400,500,600,700|Merriweather:700&display=swap',
  'icon?family=Material+Icons&display=swap',
];

const fontLinks =
  (<>
    <link
      rel = 'preconnect'
      href = { googleApiHostname }
    />

    { fontPaths.map((fontPath) => {
      const fontUrl = `${ googleApiHostname }/${ fontPath }`;

      return (<>
        <link
          rel = 'preload'
          as = 'style'
          href = { fontUrl }
        />

        <link
          rel = 'stylesheet'
          href = { fontUrl }
          media = 'print'
          // @ts-ignore
          onLoad = 'this.media="all"'
        />

        <noscript>
          <link
            rel = 'stylesheet'
            href = { fontUrl }
          />
        </noscript>
      </>);
    })}
  </>);

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

        { fontLinks }

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
