import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { tenants as localTenants, TenantConfig } from '@/config/tenants';

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
  appTitle: string;
  appSubtitle: string;
}

interface TenantContextValue {
  tenant: Tenant | null;
  isLoading: boolean;
  error: string | null;
  setTenantBySlug: (slug: string) => Promise<void>;
  isServiceEnabled: (serviceType: string) => boolean;
}

const TenantContext = createContext<TenantContextValue | undefined>(undefined);

const DEFAULT_TENANT_SLUG = 'default';

// Validate HSL color format to prevent CSS injection
function sanitizeHSLColor(color: string): string | null {
  const hslRegex = /^\d{1,3}\s+\d{1,3}%\s+\d{1,3}%$/;
  if (!hslRegex.test(color.trim())) {
    console.warn('Invalid HSL color value rejected:', color);
    return null;
  }
  return color.trim();
}

// Resolve tenant slug SYNCHRONOUSLY at module load time (before any React render).
// This guarantees we capture ?tenant= from the URL before React Router strips it.
function resolveTenantSlug(): string {
  // 1. URL query parameter has highest priority
  const urlParams = new URLSearchParams(window.location.search);
  const paramSlug = urlParams.get('tenant');
  if (paramSlug) {
    localStorage.setItem('dobro_tenant_slug', paramSlug);
    return paramSlug;
  }

  // 2. Check localStorage (persisted from previous URL param)
  const storedSlug = localStorage.getItem('dobro_tenant_slug');
  if (storedSlug) return storedSlug;

  // 3. Fallback: check hostname subdomain
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  if (parts.length >= 3 && parts[0] !== 'www') {
    localStorage.setItem('dobro_tenant_slug', parts[0]);
    return parts[0];
  }

  return DEFAULT_TENANT_SLUG;
}

// Capture at module load — guaranteed before React Router runs
const INITIAL_TENANT_SLUG = resolveTenantSlug();

// Apply tenant theme as CSS variables
function applyThemeToDocument(theme: TenantTheme, slug: string) {
  const root = document.documentElement;
  root.setAttribute('data-tenant', slug);

  const primary = sanitizeHSLColor(theme.primary);
  const secondary = sanitizeHSLColor(theme.secondary);
  const accent = sanitizeHSLColor(theme.accent);

  if (primary) {
    root.style.setProperty('--tenant-primary', primary);
    root.style.setProperty('--primary', primary);
    root.style.setProperty('--ring', primary);
    root.style.setProperty('--glow-primary', `${primary} / 0.4`);
  }
  if (secondary) root.style.setProperty('--tenant-secondary', secondary);
  if (accent) root.style.setProperty('--tenant-accent', accent);
}

const DEFAULT_QUOTAS: TenantQuotas = {
  free_ai_messages: 100,
  free_expert_minutes: 30,
};

function buildTenantFromConfig(config: TenantConfig): Tenant {
  const theme: TenantTheme = {
    primary: config.accentColor,
    secondary: `${config.accentColor.split(' ')[0]} 70% 95%`,
    accent: config.accentColor,
  };
  return {
    id: config.id,
    slug: config.slug,
    name: config.name,
    logo_url: null,
    ai_name: `${config.name} AI`,
    welcome_text: 'Чем могу помочь?',
    theme,
    enabled_services: config.enabledServices,
    quotas: DEFAULT_QUOTAS,
    is_active: true,
    appTitle: config.appTitle,
    appSubtitle: config.appSubtitle,
  };
}

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTenant = async (slug: string) => {
    setIsLoading(true);
    setError(null);

    // First, resolve from local config
    const localConfig = localTenants[slug] || localTenants[DEFAULT_TENANT_SLUG];
    const localTenant = buildTenantFromConfig(localConfig);

    try {
      // Try DB overlay (for tenants that exist in DB)
      const dbSlug = slug === 'default' ? 'dobro' : slug;
      const { data, error: fetchError } = await supabase
        .from('public_tenant_info')
        .select('*')
        .eq('slug', dbSlug)
        .eq('is_active', true)
        .maybeSingle();

      if (data && !fetchError) {
        const themeData = (data.theme as unknown as TenantTheme) || localTenant.theme;
        const merged: Tenant = {
          ...localTenant,
          id: data.id || localTenant.id,
          logo_url: data.logo_url,
          ai_name: data.ai_name || localTenant.ai_name,
          welcome_text: data.welcome_text || localTenant.welcome_text,
          theme: themeData,
        };
        setTenant(merged);
        applyThemeToDocument(merged.theme, localConfig.slug);
      } else {
        setTenant(localTenant);
        applyThemeToDocument(localTenant.theme, localConfig.slug);
      }
    } catch (err) {
      console.error('Failed to fetch tenant from DB, using local config:', err);
      setTenant(localTenant);
      applyThemeToDocument(localTenant.theme, localConfig.slug);
    } finally {
      setIsLoading(false);
    }
  };

  const setTenantBySlug = async (slug: string) => {
    localStorage.setItem('dobro_tenant_slug', slug);
    await fetchTenant(slug);
  };

  const isServiceEnabled = (serviceType: string): boolean => {
    if (!tenant) return true;
    return tenant.enabled_services.includes(serviceType);
  };

  useEffect(() => {
    fetchTenant(INITIAL_TENANT_SLUG);
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
