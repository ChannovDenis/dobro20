-- 1. Add session_id column to topics table for anonymous session isolation
ALTER TABLE public.topics ADD COLUMN IF NOT EXISTS session_id TEXT;
CREATE INDEX IF NOT EXISTS idx_topics_session ON public.topics(session_id);

-- 2. Drop existing anonymous policies for topics
DROP POLICY IF EXISTS "Anonymous can create topics" ON public.topics;
DROP POLICY IF EXISTS "Anonymous can view their session topics" ON public.topics;

-- 3. Create new session-based policies for anonymous topics
CREATE POLICY "Anonymous can create topics with session" 
ON public.topics 
FOR INSERT 
TO anon
WITH CHECK (user_id IS NULL AND session_id IS NOT NULL);

CREATE POLICY "Anonymous can view their session topics" 
ON public.topics 
FOR SELECT 
TO anon
USING (user_id IS NULL AND session_id = current_setting('request.headers', true)::json->>'x-session-id');

-- 4. Drop existing anonymous policies for topic_messages  
DROP POLICY IF EXISTS "Anonymous can insert messages in anonymous topics" ON public.topic_messages;
DROP POLICY IF EXISTS "Anonymous can view messages in anonymous topics" ON public.topic_messages;

-- 5. Create session-based policies for anonymous topic_messages
CREATE POLICY "Anonymous can insert messages in session topics" 
ON public.topic_messages 
FOR INSERT 
TO anon
WITH CHECK (EXISTS (
  SELECT 1 FROM topics 
  WHERE topics.id = topic_messages.topic_id 
  AND topics.user_id IS NULL 
  AND topics.session_id = current_setting('request.headers', true)::json->>'x-session-id'
));

CREATE POLICY "Anonymous can view messages in session topics" 
ON public.topic_messages 
FOR SELECT 
TO anon
USING (EXISTS (
  SELECT 1 FROM topics 
  WHERE topics.id = topic_messages.topic_id 
  AND topics.user_id IS NULL 
  AND topics.session_id = current_setting('request.headers', true)::json->>'x-session-id'
));

-- 6. Fix tenants table - limit public visibility to only basic info
DROP POLICY IF EXISTS "Anyone can view active tenants" ON public.tenants;

-- Create a view for public tenant info (only non-sensitive fields)
CREATE OR REPLACE VIEW public.public_tenant_info AS
SELECT id, slug, name, logo_url, ai_name, welcome_text, theme, is_active
FROM public.tenants
WHERE is_active = true;

-- Grant access to the view
GRANT SELECT ON public.public_tenant_info TO anon, authenticated;

-- Add restrictive policy - only authenticated users who belong to tenant can see full details
CREATE POLICY "Authenticated users can view their tenant details" 
ON public.tenants 
FOR SELECT 
TO authenticated
USING (
  is_active = true AND (
    -- User belongs to this tenant
    EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.tenant_id = tenants.id)
    OR
    -- User is a partner admin for this tenant
    EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.tenant_id = tenants.id AND user_roles.role = 'partner_admin'::app_role)
    OR
    -- User is a super admin
    has_role(auth.uid(), 'super_admin'::app_role)
  )
);

-- 7. Fix analytics_events insert policy to validate user ownership
DROP POLICY IF EXISTS "Validated analytics events insert" ON public.analytics_events;

CREATE POLICY "Validated analytics events insert" 
ON public.analytics_events 
FOR INSERT 
TO authenticated, anon
WITH CHECK (
  event_type IS NOT NULL 
  AND event_type = ANY (ARRAY['feed_view', 'chat_start', 'service_click', 'expert_request', 'expert_booked', 'topic_created', 'message_sent', 'mini_app_open', 'page_view'])
  AND (
    -- Authenticated users can only insert events for themselves
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR
    -- Anonymous users can only insert events with null user_id
    (auth.uid() IS NULL AND user_id IS NULL)
  )
);