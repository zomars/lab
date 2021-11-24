import React, { ReactElement } from 'react';
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';

import { okaidia } from 'react-syntax-highlighter/dist/esm/styles/prism';

import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css';

import { IReactNodeProps } from '../../types/common.types';

// https://github.com/react-syntax-highlighter/react-syntax-highlighter/
// blob/master/AVAILABLE_LANGUAGES_PRISM.MD

SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('yaml', yaml);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('css', css);

interface ICodeSnippetProps extends IReactNodeProps {
  children: string;
  className: string;
}

export function CodeSnippet(props: ICodeSnippetProps): ReactElement {
  const { className: prefixedLanguage } = props;
  const [, language] = prefixedLanguage.split('-');

  return (
    <SyntaxHighlighter
      style = { okaidia }
      language = { language }
    >
      { props.children }
    </SyntaxHighlighter>
  );
}
