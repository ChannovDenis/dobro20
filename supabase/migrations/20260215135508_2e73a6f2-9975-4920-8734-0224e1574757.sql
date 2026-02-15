
-- 1. Table: bookings
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT,
  expert_id TEXT NOT NULL,
  expert_name TEXT NOT NULL,
  specialty TEXT,
  service_id TEXT NOT NULL,
  service_name TEXT,
  slot_date DATE NOT NULL,
  slot_time TEXT NOT NULL,
  consultation_type TEXT NOT NULL DEFAULT 'online' CHECK (consultation_type IN ('online','chat')),
  price TEXT,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming','completed','cancelled')),
  tenant_id TEXT NOT NULL DEFAULT 'default',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bookings"
  ON public.bookings FOR SELECT
  USING (
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR
    (auth.uid() IS NULL AND user_id IS NULL AND session_id = (current_setting('request.headers', true)::json ->> 'x-session-id'))
  );

CREATE POLICY "Users can insert their own bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR
    (auth.uid() IS NULL AND user_id IS NULL AND session_id IS NOT NULL)
  );

CREATE POLICY "Users can update their own bookings"
  ON public.bookings FOR UPDATE
  USING (
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR
    (auth.uid() IS NULL AND user_id IS NULL AND session_id = (current_setting('request.headers', true)::json ->> 'x-session-id'))
  );

-- 2. DELETE policy on topic_messages
CREATE POLICY "Users can delete messages in their topics"
  ON public.topic_messages FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM topics
      WHERE topics.id = topic_messages.topic_id
        AND topics.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM topics
      WHERE topics.id = topic_messages.topic_id
        AND topics.user_id IS NULL
        AND topics.session_id = (current_setting('request.headers', true)::json ->> 'x-session-id')
    )
  );

-- 3. Table: feed_items
CREATE TABLE public.feed_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'default',
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  video_url TEXT,
  tags TEXT[],
  author_name TEXT,
  author_avatar TEXT,
  type TEXT NOT NULL DEFAULT 'content' CHECK (type IN ('content','service-promo','miniapp-promo')),
  target_service TEXT,
  target_prompt TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.feed_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published feed items"
  ON public.feed_items FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can manage feed items"
  ON public.feed_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
        AND user_roles.role IN ('partner_admin', 'super_admin')
    )
  );
