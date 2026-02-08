import { useState, useRef } from "react";
import { Send, Plus, Loader2, Camera, Mic, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";

const MENU_ITEMS = [
  { icon: "🌱", label: "Доброградка", prompt: "Я Доброградка — твой садовый помощник. Подскажу что сажать в твоём регионе! Напиши свой город или регион." },
  { icon: "⚖️", label: "Юрист", prompt: "Я юрист. Чем могу помочь?" },
  { icon: "🩺", label: "Врач", prompt: "Я врач. Опишите симптомы." },
  { icon: "🧠", label: "Психолог", prompt: "Я психолог. Расскажите, что вас беспокоит." },
  { icon: "💰", label: "Финансы", prompt: "Я финансовый консультант. Какой у вас вопрос?" },
  { icon: "👗", label: "Стилист", prompt: "Я стилист Лиза. Помогу с образом!" },
  { icon: "🛡️", label: "Безопасность", prompt: "Я эксперт по безопасности. Чем помочь?" },
  { icon: "🐕", label: "Ветеринар", prompt: "Я ветеринар. Расскажите о питомце." },
  { icon: "💪", label: "ЗОЖ", prompt: "Я тренер по здоровому образу жизни. Чем помочь?" },
];

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
  onImageSelect?: (file: File, url: string) => void;
  uploadedPhotoUrl?: string;
  onClearPhoto?: () => void;
}

export function ChatInput({ 
  onSend, 
  isLoading = false, 
  onImageSelect,
  uploadedPhotoUrl,
  onClearPhoto,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isRecording, duration, startRecording, stopRecording, cancelRecording } = useVoiceRecorder();

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSend(message.trim());
      setMessage("");
    }
  };

  const handleMenuItemClick = (prompt: string) => {
    onSend(prompt);
    setShowMenu(false);
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
    setShowMenu(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImageSelect) {
      const url = URL.createObjectURL(file);
      onImageSelect(file, url);
    }
    e.target.value = "";
  };

  return (
    <>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Menu Modal */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
            onClick={() => setShowMenu(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-0 left-0 right-0 glass-card rounded-t-3xl p-4 max-h-[50vh] overflow-y-auto"
            >
              <div className="w-12 h-1 bg-muted-foreground/30 rounded-full mx-auto mb-3" />
              
              {/* Photo button */}
              {onImageSelect && (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePhotoClick}
                  className="w-full flex items-center gap-3 p-3 glass rounded-xl hover:bg-primary/10 transition-colors mb-2"
                >
                  <Camera className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-foreground">Загрузить фото</span>
                </motion.button>
              )}

              {/* Experts grid */}
              <div className="grid grid-cols-2 gap-2">
                {MENU_ITEMS.map((item) => (
                  <motion.button
                    key={item.label}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleMenuItemClick(item.prompt)}
                    className="flex items-center gap-2 p-3 glass rounded-xl hover:bg-primary/10 transition-colors text-left"
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm text-foreground">{item.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Uploaded photo preview */}
      {uploadedPhotoUrl && (
        <div className="fixed bottom-32 left-4 z-30">
          <div className="relative">
            <img 
              src={uploadedPhotoUrl} 
              alt="Uploaded" 
              className="w-16 h-16 object-cover rounded-xl border border-border"
            />
            <button
              onClick={onClearPhoto}
              className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground rounded-full text-xs flex items-center justify-center"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Input Form */}
      <div className="fixed bottom-0 left-0 right-0 z-30 px-4 pb-4 safe-bottom bg-gradient-to-t from-background via-background to-transparent pt-4">
        <AnimatePresence mode="wait">
          {isRecording ? (
            <motion.div
              key="recording"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-center gap-3 glass-card p-2 max-w-lg mx-auto"
            >
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={cancelRecording}
                className="flex-shrink-0 text-destructive"
              >
                <X className="w-5 h-5" />
              </Button>
              
              <div className="flex-1 flex items-center gap-3">
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="w-3 h-3 rounded-full bg-destructive"
                />
                <span className="text-sm font-medium text-foreground">
                  Запись {formatDuration(duration)}
                </span>
              </div>
              
              <Button
                type="button"
                variant="gradient"
                size="icon"
                onClick={stopRecording}
                className="flex-shrink-0"
              >
                <Send className="w-5 h-5" />
              </Button>
            </motion.div>
          ) : (
            <motion.form
              key="input"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onSubmit={handleSubmit}
              className="flex items-center gap-2 glass-card p-2 max-w-lg mx-auto"
            >
              <Button
                type="button"
                variant="glass"
                size="icon-sm"
                onClick={() => setShowMenu(true)}
                className="flex-shrink-0"
              >
                <Plus className="w-5 h-5" />
              </Button>
              
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Напишите что угодно..."
                disabled={isLoading}
                className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-sm py-2"
              />
              
              {message.trim() ? (
                <Button
                  type="submit"
                  variant="gradient"
                  size="icon"
                  disabled={isLoading}
                  className="flex-shrink-0"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="glass"
                  size="icon"
                  onMouseDown={startRecording}
                  onMouseUp={stopRecording}
                  onMouseLeave={cancelRecording}
                  onTouchStart={startRecording}
                  onTouchEnd={stopRecording}
                  className="flex-shrink-0"
                >
                  <Mic className="w-5 h-5" />
                </Button>
              )}
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
