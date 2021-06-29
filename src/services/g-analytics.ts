export interface IGAnalyticsWindow extends Window {
  dataLayer: any[];
  gtag: (...args: any[]) => void;
}

export function gAnalyticsInit(window: IGAnalyticsWindow): void {
  window.dataLayer = window.dataLayer || [];

  function gtag(...args: any[]): void {
    window.dataLayer.push(args);
  }

  window.gtag = window.gtag || gtag;

  gtag('js', new Date());

  gtag('config', 'G-6G7FL8W2JR');
}
