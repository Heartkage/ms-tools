import { analytics } from './config';
import { logEvent } from 'firebase/analytics';

export const trackPageView = async (pagePath: string) => {
  const analyticsInstance = await analytics;
  if (analyticsInstance) {
    logEvent(analyticsInstance, 'page_view', {
      page_path: pagePath,
      page_title: document.title
    });
  }
};

export const trackEvent = async (eventName: string, eventParams?: Record<string, any>) => {
  const analyticsInstance = await analytics;
  if (analyticsInstance) {
    logEvent(analyticsInstance, eventName, eventParams);
  }
}; 