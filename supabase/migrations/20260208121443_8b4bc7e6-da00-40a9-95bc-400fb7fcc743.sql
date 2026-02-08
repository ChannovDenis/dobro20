-- Fix security warnings

-- 1. Fix function search_path for update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- 2. Fix overly permissive analytics_events insert policy
-- Drop the permissive policy
DROP POLICY IF EXISTS "Anyone can insert analytics events" ON public.analytics_events;

-- Create more restrictive policy that validates event_type
CREATE POLICY "Validated analytics events insert"
ON public.analytics_events FOR INSERT
TO anon, authenticated
WITH CHECK (
    event_type IS NOT NULL 
    AND event_type IN (
        'feed_view', 
        'chat_start', 
        'service_click', 
        'expert_request', 
        'expert_booked',
        'topic_created',
        'message_sent',
        'mini_app_open',
        'page_view'
    )
);