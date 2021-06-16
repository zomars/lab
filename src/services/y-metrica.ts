const yCounterId = 80972143;

/**
 * Y metrics initialization.
 */
export function yMetricsInit(
  window: Window,
  document: Document,
): void {
  const key = 'ym';
  const apiUrl = 'https://mc.yandex.ru/metrika/tag.js';

  window[key] = window[key] || function() {
    (window[key].a = window[key].a || []).push([window, document]);
  };

  window[key].l = (new Date()).valueOf();

  const scriptTagName = 'script';
  const script = document.createElement(scriptTagName) as HTMLScriptElement;

  script.defer = true;
  script.src = apiUrl;

  const firstScript = document.getElementsByTagName(scriptTagName)[0];

  firstScript.parentNode?.append(script);

  const counterOptions = {
    defer: true,
    clickmap: false,
    trackLinks: false,
    accurateTrackBounce: true,
  };

  window[key](yCounterId, 'init', counterOptions);
}
