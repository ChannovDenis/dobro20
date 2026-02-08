import { useRef } from "react";
import { motion } from "framer-motion";
import { Camera, Image, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploaderProps {
  onImageSelect: (file: File, previewUrl: string) => void;
  previewUrl?: string;
  onClear?: () => void;
  compact?: boolean;
}

export function ImageUploader({ onImageSelect, previewUrl, onClear, compact }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onImageSelect(file, url);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  if (previewUrl) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative inline-block"
      >
        <img
          src={previewUrl}
          alt="Preview"
          className="w-20 h-20 rounded-xl object-cover"
        />
        {onClear && (
          <button
            onClick={onClear}
            className="absolute -top-2 -right-2 p-1 rounded-full bg-destructive text-destructive-foreground"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </motion.div>
    );
  }

  if (compact) {
    return (
      <>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <Button
          type="button"
          variant="glass"
          size="icon-sm"
          onClick={handleClick}
          className="flex-shrink-0"
        >
          <Camera className="w-5 h-5" />
        </Button>
      </>
    );
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleClick}
        className="flex items-center gap-3 p-4 w-full glass rounded-2xl"
      >
        <div className="p-3 rounded-xl gradient-primary">
          <Image className="w-5 h-5 text-primary-foreground" />
        </div>
        <div className="text-left">
          <p className="text-sm font-medium text-foreground">Загрузить фото</p>
          <p className="text-xs text-muted-foreground">Для анализа или примерки</p>
        </div>
      </motion.button>
    </>
  );
}
