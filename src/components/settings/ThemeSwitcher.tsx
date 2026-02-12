import { motion } from "framer-motion";
import { useTenant } from "@/hooks/useTenant";
import { Check, Sun, Moon, Smartphone } from "lucide-react";
import { useState, useEffect } from "react";

type ThemeMode = "light" | "dark" | "system";

const THEMES = [
  { slug: "dobro", name: "Добросервис", color: "142 76% 36%", description: "Зелёная" },
  { slug: "gpb", name: "Газпромбанк", color: "210 100% 35%", description: "Синяя" },
  { slug: "wb", name: "Wildberries", color: "280 80% 50%", description: "Фиолетовая" },
];

const MODES = [
  { value: "light" as ThemeMode, icon: Sun, label: "Светлая" },
  { value: "dark" as ThemeMode, icon: Moon, label: "Тёмная" },
  { value: "system" as ThemeMode, icon: Smartphone, label: "Авто" },
];

function getSystemDark() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyMode(mode: ThemeMode) {
  const root = document.documentElement;
  const isDark = mode === "dark" || (mode === "system" && getSystemDark());
  root.classList.toggle("light", !isDark);
  root.classList.toggle("dark", isDark);
}

function applyThemeLocally(slug: string) {
  const theme = THEMES.find((t) => t.slug === slug);
  if (!theme) return;
  const root = document.documentElement;
  root.setAttribute("data-tenant", slug);
  root.style.setProperty("--primary", theme.color);
  root.style.setProperty("--ring", theme.color);
}

export function ThemeSwitcher() {
  const { tenant, setTenantBySlug } = useTenant();
  const [mode, setMode] = useState<ThemeMode>(() => {
    return (localStorage.getItem("theme-mode") as ThemeMode) || "dark";
  });

  const currentSlug =
    document.documentElement.getAttribute("data-tenant") || tenant?.slug || "dobro";

  // Apply mode changes + listen for system changes
  useEffect(() => {
    applyMode(mode);
    localStorage.setItem("theme-mode", mode);

    if (mode === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => applyMode("system");
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
  }, [mode]);

  const handleThemeChange = (slug: string) => {
    applyThemeLocally(slug);
    const url = new URL(window.location.href);
    url.searchParams.set("tenant", slug);
    window.history.replaceState({}, "", url.toString());
    setTenantBySlug(slug);
  };

  return (
    <div className="space-y-5 p-4">
      {/* Mode Selector */}
      <div>
        <span className="text-xs font-medium text-muted-foreground mb-2 block">Режим</span>
        <div className="grid grid-cols-3 gap-2">
          {MODES.map(({ value, icon: Icon, label }) => {
            const isActive = mode === value;
            return (
              <motion.button
                key={value}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMode(value)}
                className={`relative flex flex-col items-center p-3 rounded-xl transition-all ${
                  isActive
                    ? "glass border-2 border-primary"
                    : "glass hover:bg-secondary/30"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full mb-2 flex items-center justify-center ${
                    isActive ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-foreground">{label}</span>
                {isActive && (
                  <motion.div
                    layoutId="mode-check"
                    className="absolute top-1.5 right-1.5"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <Check className="w-3.5 h-3.5 text-primary" />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Accent Color Selector */}
      <div>
        <span className="text-xs font-medium text-muted-foreground mb-2 block">Акцент</span>
        <div className="grid grid-cols-3 gap-2">
          {THEMES.map((theme) => {
            const isActive = currentSlug === theme.slug;
            return (
              <motion.button
                key={theme.slug}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleThemeChange(theme.slug)}
                className={`relative flex flex-col items-center p-3 rounded-xl transition-all ${
                  isActive
                    ? "glass border-2 border-primary"
                    : "glass hover:bg-secondary/30"
                }`}
              >
                <div
                  className="w-10 h-10 rounded-full mb-2 flex items-center justify-center"
                  style={{ background: `hsl(${theme.color})` }}
                >
                  {isActive && <Check className="w-5 h-5 text-white" />}
                </div>
                <span className="text-xs font-medium text-foreground text-center">
                  {theme.name}
                </span>
                <span className="text-[10px] text-muted-foreground">{theme.description}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
