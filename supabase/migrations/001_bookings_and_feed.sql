-- ============================================
-- Добросервис 2.0 — SQL миграция #001
-- Выполнить в Supabase SQL Editor
-- ============================================

-- 1. Таблица бронирований экспертов
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT,
  expert_id TEXT NOT NULL,
  expert_name TEXT NOT NULL,
  specialty TEXT,
  service_id TEXT NOT NULL,
  service_name TEXT,
  slot_date DATE NOT NULL,
  slot_time TEXT NOT NULL,
  consultation_type TEXT DEFAULT 'online'
    CHECK (consultation_type IN ('online', 'chat')),
  price TEXT,
  status TEXT DEFAULT 'upcoming'
    CHECK (status IN ('upcoming', 'completed', 'cancelled')),
  tenant_id TEXT NOT NULL DEFAULT 'default',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own bookings" ON bookings
  FOR SELECT USING (
    auth.uid() = user_id
    OR session_id = current_setting('app.session_id', true)
  );

CREATE POLICY "Users create bookings" ON bookings
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    OR session_id = current_setting('app.session_id', true)
  );

CREATE POLICY "Users update own bookings" ON bookings
  FOR UPDATE USING (
    auth.uid() = user_id
    OR session_id = current_setting('app.session_id', true)
  );

-- 2. RLS DELETE на topic_messages (отсутствует!)
CREATE POLICY "Users delete own topic messages" ON topic_messages
  FOR DELETE USING (
    topic_id IN (
      SELECT id FROM topics
      WHERE user_id = auth.uid()
      OR session_id = current_setting('app.session_id', true)
    )
  );

-- 3. Таблица контента для TikTok-ленты
CREATE TABLE IF NOT EXISTS feed_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'default',
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  video_url TEXT,
  tags TEXT[],
  author_name TEXT,
  author_avatar TEXT,
  type TEXT DEFAULT 'content'
    CHECK (type IN ('content', 'service-promo', 'miniapp-promo')),
  target_service TEXT,
  target_prompt TEXT,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE feed_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone reads published feed items" ON feed_items
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins manage feed items" ON feed_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role IN ('partner_admin', 'super_admin')
    )
  );
