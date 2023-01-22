import { PreRenderHTMLArgs } from 'gatsby';
import { ReactElement, ReactNode } from 'react';

const headTagsOrder = {
  title: 10, // higher the number higher is the order
  meta: 5,
  link: 4,
  style: 3,
  noscript: 2,
  script: 1,
};

function isReactElement(node: ReactNode | ReactElement): node is ReactElement {
  return (node as ReactElement).type !== undefined;
}

export function onPreRenderHTML({
  getHeadComponents,
  replaceHeadComponents,
}: PreRenderHTMLArgs): void {
  const headComponents = getHeadComponents();

  headComponents.sort((aComponent, bComponent) => {
    let aOrder = 0;
    let bOrder = 0;

    if (isReactElement(aComponent)) {
      const { type } = aComponent;

      aOrder = headTagsOrder[`${type}`] ?? 0;
    }

    if (isReactElement(bComponent)) {
      const { type } = bComponent;

      bOrder = headTagsOrder[`${type}`] ?? 0;
    }

    return bOrder - aOrder;
  });

  // not necessary but fine
  replaceHeadComponents(headComponents);
}
