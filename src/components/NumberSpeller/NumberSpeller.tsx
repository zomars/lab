import React, {
  ChangeEvent,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from 'react';

import { TextField } from '@mui/material';
import { cn } from '@bem-react/classname';
import { spellNumber } from 'number-speller';

import { CopyToBufferButton } from '../CopyToBufferButton/CopyToBufferButton';

import './NumberSpeller.scss';

const cnNumberSpeller = cn('NumberSpeller');

interface ISpelledNumber {
  result: string;
  error?: string;
}

/**
 * Return number or NaN for wrong formatted strings.
 */
function convertToNumber(value: string): number {
  value = value.replace(/\s/g, '');

  if (value === '') {
    return NaN;
  }

  return +value;
}

/**
 * Convert number to text and provide error on failure.
 */
function spellIt(value: string): ISpelledNumber {
  // special handling for empty string
  const number = convertToNumber(value);

  let result = '';
  let error;

  if (isNaN(number)) {
    if (value !== '') {
      error = 'Please provide a valid number';
    }
  } else {
    try {
      result = spellNumber(number);
    } catch (e: unknown) {
      // eslint-disable-next-line
      error = (e as Error).message;
    }
  }

  return {
    result,
    error,
  };
}

export function NumberSpeller(): ReactElement {
  const [inputValue, setInputValue] = useState<string>('');
  const [output, setOutput] = useState<ISpelledNumber>({ result: '' });

  const inputElem = useRef<HTMLInputElement>(null);
  const outputElem = useRef<HTMLTextAreaElement>(null);

  function onInputValueChange(event: ChangeEvent<HTMLInputElement>): void {
    const { value: inputValue } = event.target;

    setInputValue(inputValue);

    setOutput(spellIt(inputValue));
  }

  function onTextareaFocus(): void {
    outputElem.current?.select();
  }

  // autoFocus prop doesn't work in FF for some reason
  useEffect(() => {
    inputElem.current?.focus();
  }, []);

  const haveOutput = !output.error && !!output.result;

  return (
    <div
      className = { cnNumberSpeller() }
      data-testid = { cnNumberSpeller() }
    >
      <TextField
        type = "text"
        label = "Number"
        variant = "outlined"
        margin = "normal"
        fullWidth
        inputRef = { inputElem }
        className = { cnNumberSpeller('Input') }
        onChange = { onInputValueChange }
        value = { inputValue }
        error = { output.error ? true : undefined }
        helperText = { output.error || null }
        InputLabelProps = {{ shrink: true }}
        inputProps = {{
          autoComplete: 'off',
          inputMode: 'numeric',
          pattern: '[0-9]*',
          'data-testid': cnNumberSpeller('Input'),
        }}
      />

      <TextField
        multiline
        label = "Result"
        minRows = "3"
        fullWidth
        margin = "normal"
        variant = "filled"
        color = "success"
        inputRef = { outputElem }
        className = { cnNumberSpeller('Output') }
        value = { output.result }
        onFocus = { onTextareaFocus }
        InputLabelProps = {{ shrink: true }}
        inputProps = {{
          readOnly: true,
          disabled: !haveOutput,
          'data-testid': cnNumberSpeller('Output'),
        }}
      />

      <CopyToBufferButton
        fullWidth
        className = { cnNumberSpeller('CopyBtn') }
        textToCopy = { output.result }
        disabled = { !haveOutput }
      >
        Copy it!
      </CopyToBufferButton>
    </div>
  );
}
