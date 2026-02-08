import { Bell, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { userProfile } from "@/data/mockData";
import { motion } from "framer-motion";
import { useTenant } from "@/hooks/useTenant";

interface TopBarProps {
  showSearch?: boolean;
  onSearchClick?: () => void;
}

export function TopBar({ showSearch = true, onSearchClick }: TopBarProps) {
  const greeting = getGreeting();
  const { tenant } = useTenant();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between px-4 py-3 safe-top"
    >
      <div className="flex items-center gap-3">
        {/* Tenant logo or user avatar */}
        {tenant?.logo_url ? (
          <img 
            src={tenant.logo_url} 
            alt={tenant.name} 
            className="w-10 h-10 object-contain"
          />
        ) : (
          <Avatar className="w-10 h-10 border-2 border-primary/30">
            <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
            <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
          </Avatar>
        )}
        <div>
          <p className="text-sm text-muted-foreground">{greeting}</p>
          <p className="font-semibold text-foreground">
            {tenant?.name || userProfile.name}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {showSearch && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onSearchClick}
            className="p-2 rounded-full glass"
          >
            <Search className="w-5 h-5 text-foreground" />
          </motion.button>
        )}
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-full glass relative"
        >
          <Bell className="w-5 h-5 text-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
        </motion.button>
      </div>
    </motion.header>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return "Доброй ночи";
  if (hour < 12) return "Доброе утро";
  if (hour < 18) return "Добрый день";
  return "Добрый вечер";
}
