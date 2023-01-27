import {
  HandlerContext,
  HandlerEvent,
  HandlerResponse,
} from '@netlify/functions';

import { verifyPayload } from './verify-payload';
import { send } from './smtp-client';

const { URL: siteUrl } = process.env;

function sleep(sec: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, sec * 1000);
  });
}

export function handler(
  request: HandlerEvent,
  context: HandlerContext,
): Promise<HandlerResponse> {
  const malformedResponse = {
    statusCode: 400,
    body: 'Bad request',
  };

  if (!verifyPayload(request)) {
    return Promise.resolve(malformedResponse);
  }

  const {
    body: requestBody,
    headers,
  } = request;

  const body = JSON.parse(requestBody);

  const emailBody = [
    'Feedback or question received:',
    '================',
    '',
    body.message,
    '',
    '================',
    `post title: ${ body.postTitle }`,
    `post url: ${ siteUrl }${ body.postId }`,
    '',
    `captcha: ${ body.captcha }`,
    `client IP: ${ headers['x-nf-client-connection-ip']}`,
    `AWS Request Id: ${ context.awsRequestId }`,
  ];

  const sendMailPromise =
    send({
      subject: `amlab ${ body.postTag } post feedback form`,
      body: emailBody.join('\r\n'),
    })
      .then(() => ({
        statusCode: 200,
        body: 'ok',
      }))
      .catch((error: Error) => ({
        statusCode: 500,
        body: error.message,
      }));

  const timeoutPromise = sleep(5);

  // both promises can only resolve
  // todo cancel smtp request on timeout
  return Promise.any([
    sendMailPromise,
    timeoutPromise,
  ]).then((value: void | HandlerResponse) => {
    if (!value) {
      return {
        statusCode: 504,
        body: 'SMTP send timeout',
      };
    }

    return value;
  });
}
