import { HandlerEvent } from '@netlify/functions';

interface IPostSendMessage {
  message: string;
  captcha: string;
  postTag: 'tech' | 'cars';
  postId: string;
  postTitle: string;
}

const validCaptchaValues = {
  cars: ['bmw', 'porsche', 'ferrari'],
  tech: ['js', 'javascript', 'html', 'css'],
};

function isPostSendMessage(
  payload: Partial<IPostSendMessage>,
): payload is IPostSendMessage {
  return typeof payload === 'object' &&
    typeof payload.message === 'string' && !!payload.message &&
    typeof payload.captcha === 'string' && !!payload.captcha &&
    (payload.postTag === 'cars' || payload.postTag === 'tech') &&
    typeof payload.postId === 'string' && !!payload.postId &&
    typeof payload.postTitle === 'string' && !!payload.postTitle;
}

function verifyCaptcha(
  captcha: string,
  postTag: 'cars' | 'tech',
): boolean {
  if (!captcha || !(postTag in validCaptchaValues)) {
    return false;
  }

  captcha = captcha.toLowerCase();

  return validCaptchaValues[postTag].includes(captcha);
}

export function verifyPayload(request: HandlerEvent): boolean {
  const {
    httpMethod: method,
    headers,
    body: requestBody,
  } = request;

  if (method !== 'POST') {
    return false;
  }

  if (
    headers['api-version'] !== '1.0' ||
    headers['content-type'] !== 'application/json' ||
    !headers.referer
  ) {
    return false;
  }

  let body: Partial<IPostSendMessage>;

  try {
    body = requestBody && JSON.parse(requestBody);
  } catch (e) {
    console.log(e);

    return false;
  }

  return isPostSendMessage(body) &&
    headers.referer.endsWith(body.postId) &&
    verifyCaptcha(body.captcha, body.postTag);
}
