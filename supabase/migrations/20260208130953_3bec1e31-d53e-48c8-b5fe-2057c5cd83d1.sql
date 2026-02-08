-- Fix the SECURITY DEFINER view issue by making it SECURITY INVOKER
DROP VIEW IF EXISTS public.public_tenant_info;

CREATE VIEW public.public_tenant_info 
WITH (security_invoker = true)
AS
SELECT id, slug, name, logo_url, ai_name, welcome_text, theme, is_active
FROM public.tenants
WHERE is_active = true;

-- Grant access to the view
GRANT SELECT ON public.public_tenant_info TO anon, authenticated;

-- Add parameter validation to has_role function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT CASE 
        WHEN _user_id IS NULL THEN false
        ELSE EXISTS (
            SELECT 1
            FROM public.user_roles
            WHERE user_id = _user_id AND role = _role
        )
    END
$$;

-- Add parameter validation to get_user_tenant function  
CREATE OR REPLACE FUNCTION public.get_user_tenant(_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT CASE
        WHEN _user_id IS NULL THEN NULL
        ELSE (
            SELECT tenant_id
            FROM public.profiles
            WHERE user_id = _user_id
            LIMIT 1
        )
    END
$$;

-- Add parameter validation to user_belongs_to_tenant function
CREATE OR REPLACE FUNCTION public.user_belongs_to_tenant(_user_id uuid, _tenant_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT CASE
        WHEN _user_id IS NULL OR _tenant_id IS NULL THEN false
        ELSE EXISTS (
            SELECT 1
            FROM public.profiles
            WHERE user_id = _user_id AND tenant_id = _tenant_id
        )
    END
$$;