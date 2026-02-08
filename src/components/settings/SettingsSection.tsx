import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { ReactNode, useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface SettingsSectionProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function SettingsSection({ icon, title, children, defaultOpen = false }: SettingsSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between p-4 glass-card">
            <div className="flex items-center gap-3">
              <div className="text-muted-foreground">
                {icon}
              </div>
              <span className="text-sm font-medium text-foreground">{title}</span>
            </div>
            <ChevronDown 
              className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`} 
            />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-2 glass-card divide-y divide-border overflow-hidden">
            {children}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </motion.div>
  );
}

interface SettingsItemProps {
  label: string;
  value?: string;
  onClick?: () => void;
  action?: ReactNode;
}

export function SettingsItem({ label, value, onClick, action }: SettingsItemProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between p-4 w-full text-left hover:bg-secondary/30 transition-colors"
    >
      <span className="text-sm font-medium text-foreground">{label}</span>
      {value && <span className="text-sm text-muted-foreground">{value}</span>}
      {action}
    </button>
  );
}
