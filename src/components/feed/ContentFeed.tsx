import { useState } from "react";
import { Play, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { contentItems, contentCategories } from "@/data/mockData";
import { cn } from "@/lib/utils";

export function ContentFeed() {
  const [activeCategory, setActiveCategory] = useState("Все");

  const filteredContent = activeCategory === "Все"
    ? contentItems
    : contentItems.filter(item => item.category === activeCategory);

  return (
    <div className="px-4 pb-24">
      <h2 className="text-lg font-semibold mb-4 text-foreground">Рекомендации</h2>
      
      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4">
        {contentCategories.map((category) => (
          <motion.button
            key={category}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveCategory(category)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
              activeCategory === category
                ? "bg-primary text-primary-foreground"
                : "glass text-muted-foreground"
            )}
          >
            {category}
          </motion.button>
        ))}
      </div>

      {/* Content cards */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredContent.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card overflow-hidden cursor-pointer"
            >
              <div className="relative">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                {item.duration && (
                  <div className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-black/70 text-white text-xs font-medium flex items-center gap-1">
                    <Play className="w-3 h-3" />
                    {item.duration}
                  </div>
                )}
                <div className="absolute top-2 left-2 px-2 py-1 rounded-full glass text-xs font-medium text-foreground">
                  {item.category}
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                  {item.title}
                </h3>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{item.author}</span>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {item.views}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
