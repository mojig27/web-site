// src/lib/analytics.ts
export function reportWebVitals(metric: any) {
    const body = JSON.stringify(metric);
    const url = '/api/analytics';
  
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, body);
    } else {
      fetch(url, { body, method: 'POST', keepalive: true });
    }
  }
  // src/lib/analytics.ts
export function sendAnalytics(metric: {
    id: string;
    name: string;
    value: number;
    label?: string;
  }) {
    const body = JSON.stringify(metric);
    
    // اگر Navigator Beacon API در دسترس است
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics', body);
    } else {
      // Fallback به Fetch API
      fetch('/api/analytics', {
        body,
        method: 'POST',
        keepalive: true
      });
    }
  }
  
  // برای Core Web Vitals
  export function reportWebVitals(metric: any) {
    switch (metric.name) {
      case 'FCP':
        // First Contentful Paint
        sendAnalytics({
          id: metric.id,
          name: metric.name,
          value: metric.value,
          label: 'Core Web Vital'
        });
        break;
      case 'LCP':
        // Largest Contentful Paint
        sendAnalytics({
          id: metric.id,
          name: metric.name,
          value: metric.value,
          label: 'Core Web Vital'
        });
        break;
      case 'CLS':
        // Cumulative Layout Shift
        sendAnalytics({
          id: metric.id,
          name: metric.name,
          value: metric.value,
          label: 'Core Web Vital'
        });
        break;
      case 'FID':
        // First Input Delay
        sendAnalytics({
          id: metric.id,
          name: metric.name,
          value: metric.value,
          label: 'Core Web Vital'
        });
        break;
      case 'TTFB':
        // Time to First Byte
        sendAnalytics({
          id: metric.id,
          name: metric.name,
          value: metric.value,
          label: 'Custom Metric'
        });
        break;
      default:
        break;
    }
  }