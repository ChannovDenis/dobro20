import { motion } from "framer-motion";
import { ColorPaletteData } from "@/types/chat";

interface ColorPaletteProps {
  data: ColorPaletteData;
}

export function ColorPalette({ data }: ColorPaletteProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 p-4 glass rounded-2xl"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🎨</span>
        <h4 className="font-semibold text-foreground">
          {data.type} — {data.season}
        </h4>
      </div>

      <p className="text-sm text-muted-foreground mb-4">{data.description}</p>

      <div className="flex gap-2 mb-4">
        {data.colors.map((color, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="w-10 h-10 rounded-xl shadow-lg"
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>

      {data.recommendations.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Рекомендации
          </p>
          {data.recommendations.map((rec, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="flex items-start gap-2 text-sm text-foreground"
            >
              <span className="text-primary">✓</span>
              <span>{rec}</span>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
