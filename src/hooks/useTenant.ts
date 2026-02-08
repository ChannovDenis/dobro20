import { useTenantContext } from '@/contexts/TenantContext';

/**
 * Hook to access tenant configuration and utilities
 */
export function useTenant() {
  const { tenant, isLoading, error, setTenantBySlug, isServiceEnabled } = useTenantContext();

  return {
    // Tenant data
    tenant,
    tenantId: tenant?.id ?? null,
    tenantSlug: tenant?.slug ?? null,
    tenantName: tenant?.name ?? 'Добросервис',
    
    // Branding
    aiName: tenant?.ai_name ?? 'Добросервис AI',
    welcomeText: tenant?.welcome_text ?? 'Чем могу помочь?',
    logoUrl: tenant?.logo_url ?? null,
    theme: tenant?.theme ?? null,
    
    // Services & quotas
    enabledServices: tenant?.enabled_services ?? [],
    quotas: tenant?.quotas ?? { free_ai_messages: 100, free_expert_minutes: 30 },
    
    // State
    isLoading,
    error,
    
    // Actions
    setTenantBySlug,
    isServiceEnabled,
  };
}
