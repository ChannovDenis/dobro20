import { motion } from "framer-motion";
import { TrendItem } from "@/types/chat";

interface TrendGalleryProps {
  items: TrendItem[];
  onSelect?: (item: TrendItem) => void;
}

export function TrendGallery({ items, onSelect }: TrendGalleryProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-4 -mx-2"
    >
      <div className="flex gap-3 overflow-x-auto px-2 pb-2 scrollbar-hide">
        {items.map((item, index) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelect?.(item)}
            className="flex-shrink-0 w-44 glass rounded-2xl overflow-hidden text-left"
          >
            <div className="relative h-28">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            </div>
            <div className="p-3">
              <h4 className="font-medium text-sm text-foreground line-clamp-1">
                {item.title}
              </h4>
              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                {item.description}
              </p>
              <div className="flex gap-1 mt-2 flex-wrap">
                {item.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-[10px] rounded-full bg-primary/20 text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
