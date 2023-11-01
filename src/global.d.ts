interface Window {
    // Extend the Window interface with the gtag function
    gtag(
      type: 'config',
      googleAnalyticsId: string,
      options?: { [key: string]: any }
    ): void;
    gtag(
      type: 'event',
      eventAction: string,
      fieldObject: { [key: string]: any }
    ): void;
    dataLayer: any[];
  }
  