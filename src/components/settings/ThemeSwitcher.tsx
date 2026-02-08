import { motion } from "framer-motion";
import { useTenant } from "@/hooks/useTenant";
import { Check } from "lucide-react";

const THEMES = [
  { 
    slug: "dobro", 
    name: "Добросервис",
    color: "142 76% 36%", // Green
    description: "Зелёная тема"
  },
  { 
    slug: "gpb", 
    name: "Газпромбанк",
    color: "210 100% 35%", // Blue
    description: "Синяя тема"
  },
  { 
    slug: "wb", 
    name: "Wildberries",
    color: "280 80% 50%", // Purple
    description: "Фиолетовая тема"
  },
];

export function ThemeSwitcher() {
  const { tenant, setTenantBySlug } = useTenant();
  const currentSlug = tenant?.slug || "dobro";

  const handleThemeChange = (slug: string) => {
    setTenantBySlug(slug);
    // Update URL param for persistence
    const url = new URL(window.location.href);
    url.searchParams.set('tenant', slug);
    window.history.replaceState({}, '', url.toString());
  };

  return (
    <div className="grid grid-cols-3 gap-3 p-4">
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
            {/* Color swatch */}
            <div 
              className="w-10 h-10 rounded-full mb-2 flex items-center justify-center"
              style={{ background: `hsl(${theme.color})` }}
            >
              {isActive && (
                <Check className="w-5 h-5 text-white" />
              )}
            </div>
            
            {/* Theme name */}
            <span className="text-xs font-medium text-foreground text-center">
              {theme.name}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {theme.description}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
