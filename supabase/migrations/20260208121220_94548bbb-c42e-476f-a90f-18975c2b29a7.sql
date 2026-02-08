-- =============================================
-- PHASE 0A: Foundation Database Schema
-- =============================================

-- 1. Create enums
CREATE TYPE public.app_role AS ENUM ('user', 'partner_admin', 'super_admin');
CREATE TYPE public.topic_status AS ENUM ('active', 'archived', 'escalated');
CREATE TYPE public.message_role AS ENUM ('user', 'assistant', 'system', 'expert');

-- 2. Tenants table (partners: GPB, WB, MES, etc.)
CREATE TABLE public.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    logo_url TEXT,
    ai_name TEXT DEFAULT 'Добросервис AI',
    welcome_text TEXT DEFAULT 'Чем могу помочь?',
    theme JSONB DEFAULT '{"primary": "142 76% 36%", "secondary": "142 70% 95%", "accent": "142 76% 36%"}'::jsonb,
    enabled_services TEXT[] DEFAULT ARRAY['garden', 'legal', 'medical', 'finance', 'style'],
    quotas JSONB DEFAULT '{"free_ai_messages": 100, "free_expert_minutes": 30}'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Profiles table (user profiles linked to tenants)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE SET NULL,
    display_name TEXT,
    avatar_url TEXT,
    subscription_tier TEXT DEFAULT 'free',
    ai_messages_used INT DEFAULT 0,
    expert_minutes_used INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. User roles table (separate for security)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (user_id, role, tenant_id)
);

-- 5. Topics table (chat threads)
CREATE TABLE public.topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    title TEXT DEFAULT 'Новый чат',
    service_type TEXT,
    context JSONB,
    status topic_status DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Topic messages table
CREATE TABLE public.topic_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id UUID REFERENCES public.topics(id) ON DELETE CASCADE NOT NULL,
    role message_role NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB,
    tokens_used INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Analytics events table
CREATE TABLE public.analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL,
    event_data JSONB,
    session_id TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_profiles_tenant ON public.profiles(tenant_id);
CREATE INDEX idx_profiles_user ON public.profiles(user_id);
CREATE INDEX idx_topics_user ON public.topics(user_id);
CREATE INDEX idx_topics_tenant ON public.topics(tenant_id);
CREATE INDEX idx_topic_messages_topic ON public.topic_messages(topic_id);
CREATE INDEX idx_analytics_tenant ON public.analytics_events(tenant_id);
CREATE INDEX idx_analytics_event_type ON public.analytics_events(event_type);
CREATE INDEX idx_analytics_created ON public.analytics_events(created_at);
CREATE INDEX idx_user_roles_user ON public.user_roles(user_id);

-- =============================================
-- SECURITY DEFINER FUNCTIONS
-- =============================================

-- Function to check user role (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
          AND role = _role
    )
$$;

-- Function to get user's tenant_id
CREATE OR REPLACE FUNCTION public.get_user_tenant(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT tenant_id
    FROM public.profiles
    WHERE user_id = _user_id
    LIMIT 1
$$;

-- Function to check if user belongs to tenant
CREATE OR REPLACE FUNCTION public.user_belongs_to_tenant(_user_id UUID, _tenant_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE user_id = _user_id
          AND tenant_id = _tenant_id
    )
$$;

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topic_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- TENANTS: Public read for active tenants
CREATE POLICY "Anyone can view active tenants"
ON public.tenants FOR SELECT
USING (is_active = true);

CREATE POLICY "Partner admins can update their tenant"
ON public.tenants FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid()
          AND role = 'partner_admin'
          AND tenant_id = tenants.id
    )
);

-- PROFILES: Users can manage their own profile
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- Partner admins can view profiles in their tenant
CREATE POLICY "Partner admins can view tenant profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid()
          AND role = 'partner_admin'
          AND tenant_id = profiles.tenant_id
    )
);

-- USER_ROLES: Users can view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Super admins can manage roles
CREATE POLICY "Super admins can manage roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'));

-- TOPICS: Users can manage their own topics
CREATE POLICY "Users can view their own topics"
ON public.topics FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can create topics"
ON public.topics FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own topics"
ON public.topics FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own topics"
ON public.topics FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Anonymous topics allowed (for guests)
CREATE POLICY "Anonymous can create topics"
ON public.topics FOR INSERT
TO anon
WITH CHECK (user_id IS NULL);

CREATE POLICY "Anonymous can view their session topics"
ON public.topics FOR SELECT
TO anon
USING (user_id IS NULL);

-- TOPIC_MESSAGES: Access through topic ownership
CREATE POLICY "Users can view messages in their topics"
ON public.topic_messages FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.topics
        WHERE topics.id = topic_messages.topic_id
          AND topics.user_id = auth.uid()
    )
);

CREATE POLICY "Users can insert messages in their topics"
ON public.topic_messages FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.topics
        WHERE topics.id = topic_messages.topic_id
          AND topics.user_id = auth.uid()
    )
);

-- Anonymous message access
CREATE POLICY "Anonymous can view messages in anonymous topics"
ON public.topic_messages FOR SELECT
TO anon
USING (
    EXISTS (
        SELECT 1 FROM public.topics
        WHERE topics.id = topic_messages.topic_id
          AND topics.user_id IS NULL
    )
);

CREATE POLICY "Anonymous can insert messages in anonymous topics"
ON public.topic_messages FOR INSERT
TO anon
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.topics
        WHERE topics.id = topic_messages.topic_id
          AND topics.user_id IS NULL
    )
);

-- ANALYTICS_EVENTS: Insert only, admins can read
CREATE POLICY "Anyone can insert analytics events"
ON public.analytics_events FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Partner admins can view tenant analytics"
ON public.analytics_events FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid()
          AND role IN ('partner_admin', 'super_admin')
          AND (tenant_id = analytics_events.tenant_id OR public.has_role(auth.uid(), 'super_admin'))
    )
);

-- =============================================
-- AUTO-UPDATE TIMESTAMPS TRIGGER
-- =============================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tenants_updated_at
    BEFORE UPDATE ON public.tenants
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_topics_updated_at
    BEFORE UPDATE ON public.topics
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- SEED DATA: 3 Demo Tenants
-- =============================================

INSERT INTO public.tenants (slug, name, logo_url, ai_name, welcome_text, theme, enabled_services) VALUES
(
    'dobro',
    'Добросервис',
    NULL,
    'Добро AI',
    'Привет! Я ваш персональный AI-помощник. Чем могу помочь?',
    '{"primary": "142 76% 36%", "secondary": "142 70% 95%", "accent": "38 92% 50%"}'::jsonb,
    ARRAY['garden', 'legal', 'medical', 'finance', 'style', 'home']
),
(
    'gpb',
    'ГПБ Консьерж',
    NULL,
    'ГПБ Помощник',
    'Добро пожаловать в сервис для сотрудников Газпромбанка!',
    '{"primary": "214 100% 28%", "secondary": "214 80% 95%", "accent": "38 92% 50%"}'::jsonb,
    ARRAY['legal', 'medical', 'finance', 'tax']
),
(
    'wb',
    'WB Стиль',
    NULL,
    'WB Стилист',
    'Привет! Я помогу подобрать идеальный образ!',
    '{"primary": "280 100% 40%", "secondary": "280 80% 95%", "accent": "330 100% 50%"}'::jsonb,
    ARRAY['style', 'returns', 'shopping']
);