import { useState, useRef, useEffect } from "react";
import { Send, Plus, Loader2, Mic, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { TemplatesModal } from "./TemplatesModal";
import { useSearchParams } from "react-router-dom";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
  onImageSelect?: (file: File, url: string) => void;
  uploadedPhotoUrl?: string;
  onClearPhoto?: () => void;
  initialPrompt?: string;
}

export function ChatInput({ 
  onSend, 
  isLoading = false, 
  onImageSelect,
  uploadedPhotoUrl,
  onClearPhoto,
  initialPrompt,
}: ChatInputProps) {
  const [message, setMessage] = useState(initialPrompt || "");
  const [showMenu, setShowMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isRecording, duration, startRecording, stopRecording, cancelRecording } = useVoiceRecorder();

  // Set initial prompt when it changes
  useEffect(() => {
    if (initialPrompt) {
      setMessage(initialPrompt);
    }
  }, [initialPrompt]);

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

  const handleSelectTemplate = (prompt: string) => {
    setMessage(prompt);
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

      {/* Templates Modal */}
      <TemplatesModal
        isOpen={showMenu}
        onClose={() => setShowMenu(false)}
        onSelectTemplate={handleSelectTemplate}
        onPhotoClick={onImageSelect ? handlePhotoClick : undefined}
        showPhotoButton={!!onImageSelect}
      />

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
