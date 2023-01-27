import React, {
  ReactElement,
  useEffect,
  useRef,
} from 'react';

import { TextField } from '@mui/material';
import { Control, Controller } from 'react-hook-form';
import { cn } from '@bem-react/classname';

import { ISendMessageFormPayload } from '../../../types/forms.types';

import './MessageField.scss';

interface IMessageFieldProps {
  control: Control<ISendMessageFormPayload>;
  className?: string;
}

const cnMessageField = cn('MessageField');

export function MessageField(
  { control, className }: IMessageFieldProps,
): ReactElement {
  const inputRef = useRef<HTMLInputElement>();

  const rules = {
    required: true,
    minLength: 8,
    maxLength: 1024,
  };

  useEffect(() => {
    const { current: input } = inputRef;

    input && input.focus();
  }, []);

  const helperText =
    `Min ${ rules.minLength } characters. ` +
    // eslint-disable-next-line quotes
    "Don't forget to mention your email if you would like to hear back";

  return (
    <Controller
      name = 'message'
      control = { control }
      rules = { rules }
      render = {
        ({ field, fieldState: { invalid: isInvalid } }) => (
          <TextField
            inputRef = { (ref) => {
              inputRef.current = ref;
              field.ref = ref;
            } }
            value = { field.value }
            onChange = { field.onChange }
            className = { className }
            InputProps = {{
              classes: {
                input: cnMessageField('Textarea'),
              },
            }}
            fullWidth
            error = { isInvalid }
            multiline
            required
            label = 'Your Message'
            helperText = { helperText }
            rows = '5'
          />)
      }
    />
  );
}
