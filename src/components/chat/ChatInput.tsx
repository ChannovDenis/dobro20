import { useState } from "react";
import { Send, Plus, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { chatTemplates } from "@/data/mockData";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
}

export function ChatInput({ onSend, isLoading = false }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSend(message.trim());
      setMessage("");
    }
  };

  const handleTemplateClick = (templateText: string) => {
    setMessage(templateText);
    setShowTemplates(false);
  };

  return (
    <>
      {/* Templates Modal */}
      <AnimatePresence>
        {showTemplates && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowTemplates(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-0 left-0 right-0 glass-card rounded-t-3xl p-6 max-h-[60vh] overflow-y-auto"
            >
              <div className="w-12 h-1 bg-muted-foreground/30 rounded-full mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-4">Шаблоны запросов</h3>
              <div className="space-y-2">
                {chatTemplates.map((template) => (
                  <motion.button
                    key={template.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleTemplateClick(template.text)}
                    className="w-full text-left p-4 glass rounded-xl hover:bg-primary/10 transition-colors"
                  >
                    <span className="text-xs text-primary font-medium">{template.category}</span>
                    <p className="text-sm text-foreground mt-1">{template.text}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="fixed bottom-20 left-0 right-0 z-30 px-4 pb-2"
      >
        <div className="flex items-center gap-2 glass-card p-2">
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowTemplates(true)}
            className="p-2 rounded-full bg-secondary text-secondary-foreground"
          >
            <Plus className="w-5 h-5" />
          </motion.button>
          
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Напишите сообщение..."
            disabled={isLoading}
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-sm py-2"
          />
          
          <motion.button
            type="submit"
            whileTap={{ scale: 0.9 }}
            disabled={!message.trim() || isLoading}
            className="p-2 rounded-full bg-primary text-primary-foreground disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </motion.button>
        </div>
      </form>
    </>
  );
}
