import React, { ReactElement, useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/prism-light';
import okaidia from 'react-syntax-highlighter/dist/esm/styles/prism/okaidia';

import { cn } from '@bem-react/classname';
import { Button, Chip } from '@mui/material';

import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css';

import { IReactNodeProps } from '../../types/common.types';
import { copyTextToBuffer } from '../../services/copy-to-buffer';

import './CodeSnippet.scss';

// https://github.com/react-syntax-highlighter/react-syntax-highlighter/
// blob/master/AVAILABLE_LANGUAGES_PRISM.MD

SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('yaml', yaml);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('css', css);

interface ICodeSnippetProps extends IReactNodeProps {
  children: string;
  className: string;
  fileName?: string;
}

const cnCodeSnippet = cn('CodeSnippet');

export function CodeSnippet(props: ICodeSnippetProps): ReactElement {
  const { className: prefixedLanguage, fileName } = props;
  const [, language] = prefixedLanguage.split('-');

  const [copyInProgress, setCopyInProgress] = useState(false);

  function copyTextEventHandler(): void {
    setCopyInProgress(true);

    copyTextToBuffer(props.children)
      .then(() => setCopyInProgress(false));
  }

  const rootPreTagStyles = {
    margin: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  };

  return (
    <div
      className = { cnCodeSnippet()}
    >
      <Button
        className = { cnCodeSnippet('CopyButton') }
        disabled = { copyInProgress }
        onClick = { copyTextEventHandler }
        variant = 'contained'
        size = 'small'
      >
        Copy
      </Button>

      <SyntaxHighlighter
        style = { okaidia }
        language = { language }
        customStyle = { rootPreTagStyles }
      >
        { props.children }
      </SyntaxHighlighter>

      <div
        className = { cnCodeSnippet('Summary')}
      >
        <Chip
          label = { fileName || language }
          color = 'primary'
          size = 'small'
        />
      </div>
    </div>
  );
}
