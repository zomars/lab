import React from 'react';
import { Header } from '../components/Header/Header'

// adding header
export function wrapPageElement({ element, props }) {
  return (
    <React.Fragment>
      <Header {...props} />
      { element }
    </React.Fragment>
  );
}
