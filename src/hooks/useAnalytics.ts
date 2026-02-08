import { useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from './useTenant';
import { getSessionId } from '@/lib/session';

// Allowed event types (must match RLS policy)
export type AnalyticsEventType = 
  | 'feed_view'
  | 'chat_start'
  | 'service_click'
  | 'expert_request'
  | 'expert_booked'
  | 'topic_created'
  | 'message_sent'
  | 'mini_app_open'
  | 'page_view';

interface EventData {
  [key: string]: unknown;
}

export function useAnalytics() {
  const { tenantId } = useTenant();
  const sessionId = useRef(getSessionId());

  // Use the session ID from the shared session module

  /**
   * Track an analytics event
   */
  const track = useCallback(async (
    eventType: AnalyticsEventType,
    eventData?: EventData
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const insertData: {
        tenant_id: string | null;
        user_id: string | null;
        event_type: string;
        event_data: Record<string, unknown> | null;
        session_id: string;
      } = {
        tenant_id: tenantId ?? null,
        user_id: user?.id ?? null,
        event_type: eventType,
        event_data: eventData ?? null,
        session_id: sessionId.current,
      };

      const { error } = await supabase
        .from('analytics_events')
        .insert(insertData as never);

      if (error) {
        console.warn('Failed to track event:', error);
      }
    } catch (err) {
      console.warn('Analytics tracking error:', err);
    }
  }, [tenantId]);

  /**
   * Track page view
   */
  const trackPageView = useCallback((pageName: string, metadata?: EventData) => {
    track('page_view', { page: pageName, ...metadata });
  }, [track]);

  /**
   * Track feed view
   */
  const trackFeedView = useCallback((feedItemId?: string, feedItemType?: string) => {
    track('feed_view', { feed_item_id: feedItemId, feed_item_type: feedItemType });
  }, [track]);

  /**
   * Track chat start
   */
  const trackChatStart = useCallback((topicId: string, source?: string) => {
    track('chat_start', { topic_id: topicId, source });
  }, [track]);

  /**
   * Track service click
   */
  const trackServiceClick = useCallback((serviceId: string, serviceName: string) => {
    track('service_click', { service_id: serviceId, service_name: serviceName });
  }, [track]);

  /**
   * Track expert request
   */
  const trackExpertRequest = useCallback((topicId: string, expertType: string) => {
    track('expert_request', { topic_id: topicId, expert_type: expertType });
  }, [track]);

  /**
   * Track expert booked
   */
  const trackExpertBooked = useCallback((sessionId: string, expertType: string, scheduledAt: string) => {
    track('expert_booked', { 
      session_id: sessionId, 
      expert_type: expertType,
      scheduled_at: scheduledAt 
    });
  }, [track]);

  /**
   * Track topic created
   */
  const trackTopicCreated = useCallback((topicId: string, serviceType?: string, source?: string) => {
    track('topic_created', { topic_id: topicId, service_type: serviceType, source });
  }, [track]);

  /**
   * Track message sent
   */
  const trackMessageSent = useCallback((topicId: string, role: string) => {
    track('message_sent', { topic_id: topicId, role });
  }, [track]);

  /**
   * Track mini app open
   */
  const trackMiniAppOpen = useCallback((appId: string, appName: string) => {
    track('mini_app_open', { app_id: appId, app_name: appName });
  }, [track]);

  return {
    track,
    trackPageView,
    trackFeedView,
    trackChatStart,
    trackServiceClick,
    trackExpertRequest,
    trackExpertBooked,
    trackTopicCreated,
    trackMessageSent,
    trackMiniAppOpen,
  };
}
