import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface TenantTheme {
  primary: string;
  secondary: string;
  accent: string;
}

export interface TenantQuotas {
  free_ai_messages: number;
  free_expert_minutes: number;
}

export interface Tenant {
  id: string;
  slug: string;
  name: string;
  logo_url: string | null;
  ai_name: string;
  welcome_text: string;
  theme: TenantTheme;
  enabled_services: string[];
  quotas: TenantQuotas;
  is_active: boolean;
}

interface TenantContextValue {
  tenant: Tenant | null;
  isLoading: boolean;
  error: string | null;
  setTenantBySlug: (slug: string) => Promise<void>;
  isServiceEnabled: (serviceType: string) => boolean;
}

const TenantContext = createContext<TenantContextValue | undefined>(undefined);

const DEFAULT_TENANT_SLUG = 'dobro';

// Apply tenant theme as CSS variables
function applyThemeToDocument(theme: TenantTheme) {
  const root = document.documentElement;
  root.style.setProperty('--tenant-primary', theme.primary);
  root.style.setProperty('--tenant-secondary', theme.secondary);
  root.style.setProperty('--tenant-accent', theme.accent);
}

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Resolve tenant slug from URL params or subdomain
  const resolveTenantSlug = (): string => {
    // Check URL param first: ?tenant=gpb
    const urlParams = new URLSearchParams(window.location.search);
    const paramSlug = urlParams.get('tenant');
    if (paramSlug) return paramSlug;

    // Check subdomain: gpb.dobroservis.ru
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    if (parts.length >= 3 && parts[0] !== 'www') {
      return parts[0];
    }

    // Default tenant
    return DEFAULT_TENANT_SLUG;
  };

  const fetchTenant = async (slug: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('tenants')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (fetchError) {
        // Fallback to default tenant
        if (slug !== DEFAULT_TENANT_SLUG) {
          console.warn(`Tenant "${slug}" not found, falling back to default`);
          return fetchTenant(DEFAULT_TENANT_SLUG);
        }
        throw fetchError;
      }

      const themeData = data.theme as unknown as TenantTheme;
      const quotasData = data.quotas as unknown as TenantQuotas;

      const tenantData: Tenant = {
        id: data.id,
        slug: data.slug,
        name: data.name,
        logo_url: data.logo_url,
        ai_name: data.ai_name || 'Добросервис AI',
        welcome_text: data.welcome_text || 'Чем могу помочь?',
        theme: themeData,
        enabled_services: data.enabled_services || [],
        quotas: quotasData,
        is_active: data.is_active,
      };

      setTenant(tenantData);
      applyThemeToDocument(tenantData.theme);
    } catch (err) {
      console.error('Failed to fetch tenant:', err);
      setError('Не удалось загрузить конфигурацию');
    } finally {
      setIsLoading(false);
    }
  };

  const setTenantBySlug = async (slug: string) => {
    await fetchTenant(slug);
  };

  const isServiceEnabled = (serviceType: string): boolean => {
    if (!tenant) return true; // Allow all if no tenant loaded
    return tenant.enabled_services.includes(serviceType);
  };

  // Initial load
  useEffect(() => {
    const slug = resolveTenantSlug();
    fetchTenant(slug);
  }, []);

  const value = useMemo(() => ({
    tenant,
    isLoading,
    error,
    setTenantBySlug,
    isServiceEnabled,
  }), [tenant, isLoading, error]);

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenantContext() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenantContext must be used within a TenantProvider');
  }
  return context;
}
