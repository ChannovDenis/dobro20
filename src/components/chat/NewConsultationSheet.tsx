import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { AI_ASSISTANTS } from "@/constants/aiAssistants";
import { useTenantContext } from "@/contexts/TenantContext";

interface NewConsultationSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewConsultationSheet({ open, onOpenChange }: NewConsultationSheetProps) {
  const navigate = useNavigate();
  const { tenant } = useTenantContext();

  const filteredAssistants = useMemo(() => {
    const enabledServices = tenant?.enabled_services || [];
    const allAssistants = Object.values(AI_ASSISTANTS).filter(
      (a, i, arr) => a.id !== "default" && a.id !== "wellness" && a.id !== "style" && arr.findIndex(b => b.name === a.name) === i
    );
    if (enabledServices.length === 0) return allAssistants;
    // Filter by enabled services, keep 'assistant' always first
    const filtered = allAssistants.filter(a => enabledServices.includes(a.id));
    const assistantDefault = filtered.find(a => a.id === 'assistant');
    const rest = filtered.filter(a => a.id !== 'assistant');
    return assistantDefault ? [assistantDefault, ...rest] : rest;
  }, [tenant]);

  const handleSelect = (slug: string) => {
    onOpenChange(false);
    navigate(`/chat?service=${slug}`);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Выберите ассистента</DrawerTitle>
        </DrawerHeader>
        <div className="grid grid-cols-4 gap-4 px-4 pb-8">
          {filteredAssistants.map(assistant => {
            const Icon = assistant.icon;
            return (
              <button
                key={assistant.id}
                onClick={() => handleSelect(assistant.id)}
                className="flex flex-col items-center gap-1.5"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, hsl(${assistant.color}), hsl(${assistant.color} / 0.7))` }}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-foreground text-center leading-tight">
                  {assistant.name.split(" ")[0]}
                </span>
              </button>
            );
          })}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
