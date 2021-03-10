import React from 'react';
import { Footer } from './src/components/Footer/Footer'

export const onRenderBody = ({ setPostBodyComponents }) => {
  setPostBodyComponents([
    <Footer key='footer'/>,
  ]);
}
