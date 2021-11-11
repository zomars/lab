import { ReplaceRendererArgs } from 'gatsby';
// @ts-ignore-next-line
import { replaceRenderer as muiReplaceRenderer } from 'gatsby-plugin-material-ui/gatsby-ssr';
// @ts-ignore-next-line
import { onRenderBody as reactHelmetOnRenderBody } from 'gatsby-plugin-react-helmet/gatsby-ssr';

export function replaceRenderer(replaceRendererArgs: ReplaceRendererArgs): void {
  muiReplaceRenderer(replaceRendererArgs); // calls renderToString inside
  reactHelmetOnRenderBody(replaceRendererArgs); // calls Helmet.renderStatic()
}
