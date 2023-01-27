import React, {
  ReactElement,
  useCallback,
  useState,
} from 'react';

import { cn } from '@bem-react/classname';
import { Close as CloseIcon } from '@mui/icons-material';
import { useForm } from 'react-hook-form';

import {
  Alert,
  AlertTitle,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Slide,
} from '@mui/material';

import LoadingButton from '@mui/lab/LoadingButton';
import { netlifyFunctionsApiPrefix } from '../../constants';
import { ISendMessageFormPayload } from '../../types/forms.types';
import { usePost } from '../../hooks/usePost';
import { useSnackbarAlertDispatch } from '../../hooks/useSnackbarAlert';
import { apiRequest } from '../../services/api-request';
import { EGtmEventTypes, gtmEventEmitter } from '../../services/gtm-event-emitter';
import { MessageCaptchaField } from './MessageCaptchaField/MessageCaptchaField';
import { MessageField } from './MessageField/MessageField';

import './SendMessageDialog.scss';

interface ISendMessageDialogProps {
  onClose: () => void;
  postTag: 'tech' | 'cars';
}

const cnSendMessageDialog = cn('SendMessageDialog');

export function SendMessageDialog(props: ISendMessageDialogProps): ReactElement {
  const [isOpen, setIsOpen] = useState(true);
  const [requestError, setRequestError] = useState('');
  const [messageSent, setMessageAsSent] = useState(false);

  const {
    control,
    handleSubmit,
    formState,
  } = useForm<ISendMessageFormPayload>({
    mode: 'onChange',
    shouldUseNativeValidation: false, // otherwise .getting focus() issues
    shouldUnregister: true,
    shouldFocusError: false,
    defaultValues: {
      message: '',
      captcha: '',
    },
  });

  const post = usePost();
  const alertDispatch = useSnackbarAlertDispatch();

  const transitionProps = {
    direction: messageSent ? 'left' : 'right', // swipe right if sent, left otherwise
    exit: true,
    timeout: 250,
    onExited: props.onClose,
  };

  const closeDialog = useCallback(
    (formGotSubmitted = false): void => {
      setIsOpen(false);

      gtmEventEmitter(EGtmEventTypes.post_send_message_close, {
        post_send_message_sent: formGotSubmitted,
        post_id: post?.path || '',
        post_header: post?.title || '',
      });

      if (formGotSubmitted) {
        setMessageAsSent(true);

        alertDispatch({
          type: 'add',
          alert: {
            id: 'send-message-dialog',
            text: 'Your message was sent. TY!',
            autoHide: true,
          },
        });
      }
    }, [
      post,
      setIsOpen,
      alertDispatch,
    ]
  );

  const formSubmit = useCallback(
    ({ message, captcha }: ISendMessageFormPayload): Promise<void> => {
      setRequestError('');

      return apiRequest(
        `${ netlifyFunctionsApiPrefix }/post-send-message`,
        'post',
        {
          message,
          captcha,
          postTag: props.postTag,
          postId: post?.path || '',
          postTitle: post?.title || '',
        }
      )
        .then(() => closeDialog(true))
        .catch(async (response: Response) => {
          // working around github.com/react-hook-form/react-hook-form/issues/9821
          // can't return rejected promise here
          const {
            status,
            statusText,
          } = response;

          const text = await response.text();

          let errorMessage = `${ status }` || 'No Response Code';

          if (statusText) {
            errorMessage += ` — ${ statusText }`;
          } else if (text) {
            errorMessage += ` — ${ text }`;
          }

          setRequestError(errorMessage);
        });
    }, [
      setRequestError,
      closeDialog,
      post,
      props.postTag,
    ]);

  return (
    <Dialog
      open = { isOpen }
      onClose = { () => closeDialog() }
      classes = {{
        paperScrollPaper: cnSendMessageDialog(),
      }}
      TransitionComponent = { Slide }
      TransitionProps = { transitionProps }
      disableRestoreFocus = { true }
      aria-describedby = 'message-the-author-dialog'
    >
      <form onSubmit = { handleSubmit(formSubmit) }>
        <IconButton
          className = { cnSendMessageDialog('CloseButton') }
          onClick = { () => closeDialog() }
        >
          <CloseIcon/>
        </IconButton>

        <DialogTitle>
          Feedback and Questions
        </DialogTitle>

        <DialogContent>
          <DialogContentText id = 'message-the-author-dialog'>
            Found a typo, have a question or want to share an idea?<br/>
            Please message me using this form:<br/>
          </DialogContentText>

          <MessageField
            control = { control }
            className = { cnSendMessageDialog('TextField') }
          />

          <MessageCaptchaField
            control = { control }
            postTag = { props.postTag }
            className = { cnSendMessageDialog('TextField') }
          />
        </DialogContent>

        { requestError ?
          <Alert severity = 'error'>
            <AlertTitle>Network Request Error</AlertTitle>
            { requestError }. Please retry
          </Alert> : null }

        <DialogActions>
          <LoadingButton
            variant = 'contained'
            type = 'submit'
            loading = { formState.isSubmitting }
            disabled = { !formState.isValid }
          >
            Send
          </LoadingButton>

          <Button
            onClick = { () => closeDialog() }
          >
            Close
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
