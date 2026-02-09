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
function applyThemeToDocument(theme: TenantTheme, slug: string) {
  const root = document.documentElement;
  
  // Set data attribute for CSS-based theming
  root.setAttribute('data-tenant', slug);
  
  // Set CSS variables from tenant theme
  root.style.setProperty('--tenant-primary', theme.primary);
  root.style.setProperty('--tenant-secondary', theme.secondary);
  root.style.setProperty('--tenant-accent', theme.accent);
  
  // Also update the main primary color to match tenant
  root.style.setProperty('--primary', theme.primary);
  root.style.setProperty('--ring', theme.primary);
  root.style.setProperty('--glow-primary', `${theme.primary} / 0.4`);
}

// Default theme and quotas for fallback
const DEFAULT_THEME: TenantTheme = {
  primary: "142 76% 36%",
  secondary: "142 70% 95%",
  accent: "142 76% 36%",
};

const DEFAULT_QUOTAS: TenantQuotas = {
  free_ai_messages: 100,
  free_expert_minutes: 30,
};

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
      // Use the public view that only exposes safe tenant information
      const { data, error: fetchError } = await supabase
        .from('public_tenant_info')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle();

      if (fetchError || !data) {
        // Fallback to default tenant
        if (slug !== DEFAULT_TENANT_SLUG) {
          console.warn(`Tenant "${slug}" not found, falling back to default`);
          return fetchTenant(DEFAULT_TENANT_SLUG);
        }
        if (fetchError) throw fetchError;
        // No data for default tenant - use fallback values
        setTenant(null);
        return;
      }

      const themeData = (data.theme as unknown as TenantTheme) || DEFAULT_THEME;

      // Note: quotas and enabled_services are not exposed in public view for security
      // They should be fetched via authenticated requests or edge functions when needed
      const tenantData: Tenant = {
        id: data.id,
        slug: data.slug,
        name: data.name,
        logo_url: data.logo_url,
        ai_name: data.ai_name || 'Добросервис AI',
        welcome_text: data.welcome_text || 'Чем могу помочь?',
        theme: themeData,
        enabled_services: [], // Not exposed in public view
        quotas: DEFAULT_QUOTAS, // Not exposed in public view
        is_active: data.is_active,
      };

      setTenant(tenantData);
      applyThemeToDocument(tenantData.theme, tenantData.slug);
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
    // Allow all services for public view (quotas are enforced server-side)
    return true;
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
