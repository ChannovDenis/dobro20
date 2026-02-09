-- Fix: Partner admins should not be able to modify quotas, is_active, or enabled_services
-- These fields should only be modifiable by super_admins

-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Partner admins can update their tenant" ON public.tenants;

-- Create a more restrictive policy that only allows updating branding fields
-- Partner admins can update: name, logo_url, ai_name, welcome_text, theme
-- Partner admins CANNOT update: quotas, is_active, enabled_services, slug
CREATE POLICY "Partner admins can update tenant branding"
ON public.tenants
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'partner_admin'
      AND user_roles.tenant_id = tenants.id
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'partner_admin'
      AND user_roles.tenant_id = tenants.id
  )
  -- Ensure sensitive fields are not modified
  AND quotas IS NOT DISTINCT FROM (SELECT quotas FROM public.tenants WHERE id = tenants.id)
  AND is_active IS NOT DISTINCT FROM (SELECT is_active FROM public.tenants WHERE id = tenants.id)
  AND enabled_services IS NOT DISTINCT FROM (SELECT enabled_services FROM public.tenants WHERE id = tenants.id)
  AND slug IS NOT DISTINCT FROM (SELECT slug FROM public.tenants WHERE id = tenants.id)
);

-- Super admins can update any tenant field
CREATE POLICY "Super admins can update any tenant"
ON public.tenants
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'super_admin'))
WITH CHECK (has_role(auth.uid(), 'super_admin'));