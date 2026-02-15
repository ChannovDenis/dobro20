import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Upload,
  Camera,
  Sparkles,
  ArrowRight,
  Home,
  Calculator,
  Sofa,
  PaintBucket,
  Lamp,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

type Step = "upload" | "analysis" | "styles" | "result";

// --- Mock data ---

const DEMO_ROOMS = [
  {
    id: "living",
    label: "Гостиная",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&h=600&fit=crop",
  },
  {
    id: "bedroom",
    label: "Спальня",
    image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&h=600&fit=crop",
  },
  {
    id: "kitchen",
    label: "Кухня",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop",
  },
];

const MOCK_ANALYSIS = {
  roomType: "Гостиная",
  area: "~25 м\u00B2",
  lighting: "Естественное, южная сторона",
  currentStyle: "Современный минимализм",
  ceiling: "2.7 м, ровный",
  condition: "Хорошее, косметический ремонт",
};

const STYLES = [
  {
    id: "scandi",
    name: "Скандинавский минимализм",
    desc: "Светлые тона, натуральные материалы, функциональность",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&h=400&fit=crop",
    resultImage: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=600&fit=crop",
    budget: { min: 650000, max: 950000 },
  },
  {
    id: "classic",
    name: "Современная классика",
    desc: "Элегантность, симметрия, благородные материалы",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop",
    resultImage: "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&h=600&fit=crop",
    budget: { min: 1200000, max: 1800000 },
  },
  {
    id: "loft",
    name: "Лофт",
    desc: "Открытое пространство, кирпич, металл, индустриальный шик",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop",
    resultImage: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop",
    budget: { min: 850000, max: 1200000 },
  },
  {
    id: "hitech",
    name: "Хай-тек",
    desc: "Технологичность, чистые линии, умный дом",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&h=400&fit=crop",
    resultImage: "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&h=600&fit=crop",
    budget: { min: 1500000, max: 2200000 },
  },
];

const BUDGET_CATEGORIES = [
  { name: "Мебель", icon: Sofa, percent: 35 },
  { name: "Отделка", icon: PaintBucket, percent: 30 },
  { name: "Освещение", icon: Lamp, percent: 15 },
  { name: "Декор и текстиль", icon: Home, percent: 20 },
];

function formatPrice(n: number): string {
  return n.toLocaleString("ru-RU");
}

// --- Components ---

export default function GPBArchitect() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("upload");
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const goToAnalysis = () => {
    setStep("analysis");
    setAnalysisProgress(0);
    // Simulate AI analysis progress
    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 80);
    setTimeout(() => {
      setStep("styles");
    }, 2200);
  };

  const goToResult = () => {
    setStep("result");
  };

  const style = STYLES.find((s) => s.id === selectedStyle);

  const stepIndex = { upload: 0, analysis: 1, styles: 2, result: 3 }[step];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 px-4 py-3 safe-top border-b border-border sticky top-0 bg-background/80 backdrop-blur-lg z-50"
      >
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => (step === "upload" ? navigate(-1) : setStep("upload"))}
          className="p-2 rounded-full glass"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </motion.button>
        <div className="flex-1">
          <h1 className="text-base font-bold text-foreground">AI-Архитектор</h1>
          <p className="text-xs text-muted-foreground">Газпромбанк</p>
        </div>
        <Badge
          variant="outline"
          className="text-xs"
          style={{ borderColor: "hsl(210 100% 35%)", color: "hsl(210 100% 35%)" }}
        >
          GPB
        </Badge>
      </motion.header>

      {/* Step indicator */}
      <div className="px-4 py-3">
        <div className="flex gap-2">
          {["Фото", "Анализ", "Стиль", "Результат"].map((label, i) => (
            <div key={label} className="flex-1">
              <div
                className={`h-1 rounded-full transition-colors ${
                  i <= stepIndex ? "bg-[hsl(210,100%,35%)]" : "bg-muted"
                }`}
              />
              <p
                className={`text-[10px] mt-1 text-center ${
                  i <= stepIndex ? "text-foreground font-medium" : "text-muted-foreground"
                }`}
              >
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {step === "upload" && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="px-4 pb-8"
          >
            <h2 className="text-lg font-bold mb-1">Загрузите фото комнаты</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Или выберите из демо-галереи для быстрого знакомства
            </p>

            {/* Upload zone */}
            <div className="glass-card p-8 text-center mb-4 border-2 border-dashed border-muted-foreground/20 rounded-xl">
              <Camera className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground mb-3">
                Нажмите для загрузки или перетащите фото
              </p>
              <Button variant="outline" size="sm" className="gap-2">
                <Upload className="w-4 h-4" /> Загрузить фото
              </Button>
            </div>

            {/* Demo gallery */}
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              Или выберите демо-комнату
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {DEMO_ROOMS.map((room) => (
                <motion.div
                  key={room.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedRoom(room.id)}
                  className={`relative rounded-xl overflow-hidden cursor-pointer transition-all ${
                    selectedRoom === room.id
                      ? "ring-2 ring-[hsl(210,100%,35%)] ring-offset-2 ring-offset-background"
                      : ""
                  }`}
                >
                  <img
                    src={room.image}
                    alt={room.label}
                    className="w-full h-24 object-cover"
                  />
                  {selectedRoom === room.id && (
                    <div className="absolute inset-0 bg-[hsl(210,100%,35%)]/20 flex items-center justify-center">
                      <Check className="w-6 h-6 text-white drop-shadow-lg" />
                    </div>
                  )}
                  <p className="text-xs text-center py-1.5 font-medium">{room.label}</p>
                </motion.div>
              ))}
            </div>

            <Button
              className="w-full mt-6 gap-2"
              style={{ backgroundColor: "hsl(210 100% 35%)" }}
              disabled={!selectedRoom}
              onClick={goToAnalysis}
            >
              <Sparkles className="w-4 h-4" /> Анализировать
            </Button>
          </motion.div>
        )}

        {step === "analysis" && (
          <motion.div
            key="analysis"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="px-4 pb-8"
          >
            <div className="glass-card p-6 text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-[hsl(210,100%,35%)] border-t-transparent"
              />
              <h2 className="text-lg font-bold mb-2">AI анализирует комнату...</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Определяем параметры пространства
              </p>
              <Progress value={analysisProgress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">{analysisProgress}%</p>
            </div>
          </motion.div>
        )}

        {step === "styles" && (
          <motion.div
            key="styles"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="px-4 pb-8"
          >
            {/* Analysis result card */}
            <div className="glass-card p-4 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-[hsl(210,100%,35%)]" />
                <h3 className="text-sm font-bold">Результат анализа</h3>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(MOCK_ANALYSIS).map(([key, val]) => {
                  const labels: Record<string, string> = {
                    roomType: "Тип",
                    area: "Площадь",
                    lighting: "Свет",
                    currentStyle: "Стиль",
                    ceiling: "Потолок",
                    condition: "Состояние",
                  };
                  return (
                    <div key={key} className="flex flex-col">
                      <span className="text-muted-foreground">{labels[key]}</span>
                      <span className="font-medium">{val}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <h2 className="text-lg font-bold mb-1">Выберите стиль</h2>
            <p className="text-sm text-muted-foreground mb-4">
              AI создаст визуализацию и рассчитает смету
            </p>

            <div className="grid grid-cols-2 gap-3">
              {STYLES.map((s) => (
                <motion.div
                  key={s.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedStyle(s.id)}
                  className={`rounded-xl overflow-hidden cursor-pointer transition-all glass-card ${
                    selectedStyle === s.id
                      ? "ring-2 ring-[hsl(210,100%,35%)] ring-offset-2 ring-offset-background"
                      : ""
                  }`}
                >
                  <img src={s.image} alt={s.name} className="w-full h-28 object-cover" />
                  <div className="p-3">
                    <h4 className="text-xs font-bold leading-tight">{s.name}</h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">
                      {s.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Button
              className="w-full mt-6 gap-2"
              style={{ backgroundColor: "hsl(210 100% 35%)" }}
              disabled={!selectedStyle}
              onClick={goToResult}
            >
              Показать результат <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        )}

        {step === "result" && style && (
          <motion.div
            key="result"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="px-4 pb-8"
          >
            {/* Render */}
            <div className="rounded-xl overflow-hidden mb-4 relative">
              <img
                src={style.resultImage}
                alt={style.name}
                className="w-full h-56 object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <h3 className="text-white font-bold text-sm">{style.name}</h3>
                <p className="text-white/80 text-xs">{style.desc}</p>
              </div>
              <Badge
                className="absolute top-3 right-3 bg-[hsl(210,100%,35%)] text-white text-xs"
              >
                AI-визуализация
              </Badge>
            </div>

            {/* Budget card */}
            <div className="glass-card p-4 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <Calculator className="w-4 h-4 text-[hsl(210,100%,35%)]" />
                <h3 className="text-sm font-bold">Ориентировочная стоимость</h3>
              </div>
              <p className="text-2xl font-bold text-[hsl(210,100%,35%)] mb-3">
                {formatPrice(style.budget.min)} — {formatPrice(style.budget.max)} \u20BD
              </p>
              <div className="space-y-2">
                {BUDGET_CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const min = Math.round(style.budget.min * cat.percent / 100);
                  const max = Math.round(style.budget.max * cat.percent / 100);
                  return (
                    <div key={cat.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Icon className="w-3.5 h-3.5" />
                        <span>{cat.name}</span>
                        <span className="text-[10px]">({cat.percent}%)</span>
                      </div>
                      <span className="font-medium">
                        {formatPrice(min)} — {formatPrice(max)} \u20BD
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* What's included */}
            <div className="glass-card p-4 mb-4">
              <h3 className="text-sm font-bold mb-2">Что включено</h3>
              <div className="space-y-1.5">
                {[
                  "3D-визуализация в выбранном стиле",
                  "Подбор мебели и материалов",
                  "Смета с ценами от партнёров",
                  "Консультация дизайнера (30 мин)",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs">
                    <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-3">
              <Button
                className="w-full gap-2"
                style={{ backgroundColor: "hsl(210 100% 35%)" }}
                onClick={() => navigate("/chat?service=architect")}
              >
                <Sparkles className="w-4 h-4" /> Обсудить с AI-архитектором
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setStep("styles");
                  setSelectedStyle(null);
                }}
              >
                Попробовать другой стиль
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
