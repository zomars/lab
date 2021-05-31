/**
 * @fileoverview
 *
 * Required to have index.html file created. Sic!
 * Actual content doesn't matter cause this dummy page is replaced by page programmatically
 * replaced in gatsby-node.
 */

import React, { ReactElement } from 'react';

function DummyIndexPage(): ReactElement {
  return <span/>;
}

// eslint-disable-next-line import/no-default-export
export default DummyIndexPage;
