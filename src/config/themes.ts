import { useTenant } from "@/hooks/useTenant";

export interface TenantThemeConfig {
  name: string;
  colors: {
    primary: string;
    success: string;
    background: string;
    cardBg: string;
  };
  features: {
    showScan: boolean;
    showEstimates: boolean;
    showAiStylist: boolean;
    showAiArchitect: boolean;
  };
  strings: {
    heroTitle: string;
    scanSubtitle: string;
  };
}

export const tenantThemes: Record<string, TenantThemeConfig> = {
  mes: {
    name: "Защита и справедливость",
    colors: {
      primary: "#1a73e8",
      success: "#34a853",
      background: "#1a1a2e",
      cardBg: "rgba(255,255,255,0.05)",
    },
    features: {
      showScan: true,
      showEstimates: true,
      showAiStylist: true,
      showAiArchitect: true,
    },
    strings: {
      heroTitle: "Защита и справедливость",
      scanSubtitle: "Сфотографируйте чек или смету — AI найдёт переплату",
    },
  },
  gpb: {
    name: "ГПБ Ассистент",
    colors: {
      primary: "#1a5cb0",
      success: "#16a34a",
      background: "#ffffff",
      cardBg: "rgba(26,92,176,0.05)",
    },
    features: {
      showScan: true,
      showEstimates: true,
      showAiStylist: false,
      showAiArchitect: true,
    },
    strings: {
      heroTitle: "ГПБ Ассистент",
      scanSubtitle: "Сфотографируйте чек или смету — AI сравнит цены с рыночными",
    },
  },
  wb: {
    name: "WB Стиль",
    colors: {
      primary: "#7b2d8e",
      success: "#16a34a",
      background: "#ffffff",
      cardBg: "rgba(123,45,142,0.05)",
    },
    features: {
      showScan: true,
      showEstimates: false,
      showAiStylist: true,
      showAiArchitect: false,
    },
    strings: {
      heroTitle: "WB Стиль",
      scanSubtitle: "Сфотографируйте чек или смету — AI сравнит цены с рыночными",
    },
  },
  alfa: {
    name: "Альфа Помощник",
    colors: {
      primary: "#ef3124",
      success: "#16a34a",
      background: "#ffffff",
      cardBg: "rgba(239,49,36,0.05)",
    },
    features: {
      showScan: true,
      showEstimates: true,
      showAiStylist: false,
      showAiArchitect: false,
    },
    strings: {
      heroTitle: "Альфа Помощник",
      scanSubtitle: "Сфотографируйте чек или смету — AI сравнит цены с рыночными",
    },
  },
  pochtarf: {
    name: "Почта Помощник",
    colors: {
      primary: "#005baa",
      success: "#16a34a",
      background: "#ffffff",
      cardBg: "rgba(0,91,170,0.05)",
    },
    features: {
      showScan: true,
      showEstimates: true,
      showAiStylist: false,
      showAiArchitect: false,
    },
    strings: {
      heroTitle: "Почта Помощник",
      scanSubtitle: "Сфотографируйте чек или смету — AI сравнит цены с рыночными",
    },
  },
  default: {
    name: "ДоброСервис",
    colors: {
      primary: "#2563eb",
      success: "#16a34a",
      background: "#ffffff",
      cardBg: "rgba(37,99,235,0.05)",
    },
    features: {
      showScan: true,
      showEstimates: true,
      showAiStylist: true,
      showAiArchitect: true,
    },
    strings: {
      heroTitle: "ДоброСервис",
      scanSubtitle: "Сфотографируйте чек или смету на ремонт — AI сравнит цены с рыночными",
    },
  },
};

/**
 * Hook to get current tenant theme config.
 * Falls back to default theme if tenant slug not found.
 */
export function useTenantTheme(): TenantThemeConfig {
  const { tenantSlug } = useTenant();
  const slug = tenantSlug || "default";
  return tenantThemes[slug] || tenantThemes.default;
}
