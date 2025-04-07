'use client';

import { useCallback, useEffect } from 'react';
import { trackEvent, trackGenerationMetric } from '../utils';

interface AnalyticsOptions {
  automaticPageViews?: boolean;
}

export function useAnalytics(options: AnalyticsOptions = {}) {
  const { automaticPageViews = true } = options;

  useEffect(() => {
    if (automaticPageViews && typeof window !== 'undefined') {
      // Track page view on mount
      trackEvent('page_view', {
        path: window.location.pathname,
        url: window.location.href,
      });
    }
  }, [automaticPageViews]);

  const trackPostGeneration = useCallback((data: {
    promptLength: number;
    responseTime: number;
    hasImage: boolean;
    postLength: number;
    hashtagCount: number;
    provider: string;
  }) => {
    trackEvent('post_generated', data);
    trackGenerationMetric('generation_response_time', data.responseTime);
  }, []);

  const trackPostApproval = useCallback((postId: string) => {
    trackEvent('post_approved', { postId });
  }, []);

  const trackPostRejection = useCallback((postId: string, reason?: string) => {
    trackEvent('post_rejected', { postId, reason });
  }, []);

  return {
    trackPostGeneration,
    trackPostApproval,
    trackPostRejection,
    trackEvent
  };
} 