import React, { ReactElement } from 'react';
import { TextField } from '@mui/material';
import { Control, Controller } from 'react-hook-form';
import { ISendMessageFormPayload } from '../../../types/forms.types';

interface IMessageCaptchaProps {
  control: Control<ISendMessageFormPayload>;
  postTag: 'tech' | 'cars';
  className?: string;
}

// native html regexp validation doesn't support /i modifier
const captchaPatterns = {
  tech: /^(?:css|html|js|javascript)$/i,
  cars: /^(?:porsche|ferrari|bmw)$/i,
};

const captchaChoices = {
  tech: 'HTML, CSS or JS',
  cars: 'BMW, Porsche or Ferrari',
};

export function MessageCaptchaField(
  { control, postTag, className }: IMessageCaptchaProps,
): ReactElement {
  const rules = {
    required: true,
    pattern: captchaPatterns[postTag],
  };

  return (
    <Controller
      name = 'captcha'
      control = { control }
      rules = { rules }
      render = {
        ({ field, fieldState: { invalid: isInvalid } }) => (
          <TextField
            inputRef = { field.ref }
            value = { field.value }
            onChange = { field.onChange }
            className = { className }
            error = { isInvalid }
            inputProps = {{ enterkeyhint: 'Send' }}
            required
            fullWidth
            label = { `What is better: ${ captchaChoices[postTag] }?` }
            helperText = 'Please confirm you are a human or, at least, ChatGPT'
          />)
      }
    />
  );
}
