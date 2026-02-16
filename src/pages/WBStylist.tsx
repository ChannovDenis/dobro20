import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Camera, Upload, Sparkles, ShoppingBag, ChevronRight, Star, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

// --- Mock data ---

const WARDROBE_PHOTOS = [
  {
    id: "casual",
    label: "Повседневный образ",
    image: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=600&h=800&fit=crop",
  },
  {
    id: "office",
    label: "Деловой стиль",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop",
  },
  {
    id: "evening",
    label: "Вечерний выход",
    image: "https://images.unsplash.com/photo-1518577915332-c2a19f149a75?w=600&h=800&fit=crop",
  },
];

interface AnalysisResult {
  bodyType: string;
  colorType: string;
  currentStyle: string;
  strengths: string[];
  recommendations: string[];
}

const MOCK_ANALYSIS: AnalysisResult = {
  bodyType: "Песочные часы",
  colorType: "Тёплая осень",
  currentStyle: "Casual с элементами классики",
  strengths: [
    "Хорошее чувство пропорций",
    "Правильно подобранные базовые вещи",
    "Гармоничная цветовая гамма",
  ],
  recommendations: [
    "Добавьте акцентные аксессуары",
    "Попробуйте более структурированные силуэты",
    "Рекомендуем тёплые природные оттенки",
  ],
};

interface WBProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  oldPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  tag?: string;
}

const STYLE_LOOKS = [
  {
    id: "smart-casual",
    name: "Smart Casual",
    desc: "Элегантная повседневность",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=800&fit=crop",
    products: [
      { id: "p1", name: "Блейзер оверсайз", brand: "ZARINA", price: 5990, oldPrice: 8990, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&h=400&fit=crop", rating: 4.8, reviews: 1243, tag: "Хит" },
      { id: "p2", name: "Брюки палаццо", brand: "LOVE REPUBLIC", price: 4490, image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=400&fit=crop", rating: 4.6, reviews: 892 },
      { id: "p3", name: "Водолазка базовая", brand: "BEFREE", price: 1990, oldPrice: 2990, image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300&h=400&fit=crop", rating: 4.9, reviews: 3421, tag: "Бестселлер" },
      { id: "p4", name: "Сумка-шоппер", brand: "ELEGANZZA", price: 3490, image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=300&h=400&fit=crop", rating: 4.7, reviews: 567 },
    ] as WBProduct[],
  },
  {
    id: "capsule",
    name: "Капсульный гардероб",
    desc: "15 вещей — 30 образов",
    image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&h=800&fit=crop",
    products: [
      { id: "p5", name: "Тренч классический", brand: "ZARINA", price: 7990, oldPrice: 11990, image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=300&h=400&fit=crop", rating: 4.9, reviews: 2100, tag: "Топ" },
      { id: "p6", name: "Джинсы прямые", brand: "GLORIA JEANS", price: 2990, image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=300&h=400&fit=crop", rating: 4.5, reviews: 4521 },
      { id: "p7", name: "Рубашка белая", brand: "BEFREE", price: 2490, image: "https://images.unsplash.com/photo-1598033129183-c4f50c736c10?w=300&h=400&fit=crop", rating: 4.7, reviews: 1890 },
      { id: "p8", name: "Кроссовки белые", brand: "KARI", price: 4990, oldPrice: 6990, image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=400&fit=crop", rating: 4.8, reviews: 7890, tag: "Скидка" },
    ] as WBProduct[],
  },
  {
    id: "trend",
    name: "Тренды 2026",
    desc: "Самые актуальные образы сезона",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop",
    products: [
      { id: "p9", name: "Кожаная куртка", brand: "MANGO", price: 9990, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=400&fit=crop", rating: 4.9, reviews: 3200, tag: "Тренд" },
      { id: "p10", name: "Юбка-миди плиссе", brand: "LOVE REPUBLIC", price: 3990, oldPrice: 5990, image: "https://images.unsplash.com/photo-1583496661160-fb5886a0uj68?w=300&h=400&fit=crop", rating: 4.6, reviews: 1567 },
      { id: "p11", name: "Ботинки челси", brand: "T.TACCARDI", price: 5490, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=400&fit=crop", rating: 4.7, reviews: 2340 },
      { id: "p12", name: "Шарф объёмный", brand: "ZARINA", price: 1990, image: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=300&h=400&fit=crop", rating: 4.8, reviews: 890, tag: "Новинка" },
    ] as WBProduct[],
  },
];

// --- Component ---

type Step = "upload" | "analyzing" | "analysis" | "looks" | "result";

export default function WBStylist() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("upload");
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [selectedLook, setSelectedLook] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const accentColor = "280 80% 50%"; // WB purple

  const startAnalysis = (photoId: string) => {
    setSelectedPhoto(photoId);
    setStep("analyzing");
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setStep("analysis"), 300);
          return 100;
        }
        return prev + 4;
      });
    }, 60);
  };

  const selectLook = (lookId: string) => {
    setSelectedLook(lookId);
    setStep("result");
  };

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  };

  const look = STYLE_LOOKS.find((l) => l.id === selectedLook);
  const totalPrice = look?.products.reduce((sum, p) => sum + p.price, 0) || 0;
  const totalOldPrice = look?.products.reduce((sum, p) => sum + (p.oldPrice || p.price), 0) || 0;

  const stepIndex = ["upload", "analyzing", "analysis", "looks", "result"].indexOf(step);

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
          onClick={() => (step === "upload" ? navigate(-1) : setStep(step === "result" ? "looks" : step === "looks" ? "analysis" : "upload"))}
          className="p-2 rounded-full glass"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </motion.button>
        <div className="flex-1">
          <h1 className="text-base font-bold text-foreground">AI-Стилист</h1>
          <p className="text-xs text-muted-foreground">Персональный подбор образа</p>
        </div>
        <Badge
          variant="secondary"
          className="text-xs gap-1"
          style={{ backgroundColor: `hsl(${accentColor} / 0.15)`, color: `hsl(${accentColor})` }}
        >
          <Sparkles className="w-3 h-3" /> WB
        </Badge>
      </motion.header>

      {/* Step indicator */}
      <div className="px-4 pt-3 pb-1">
        <div className="flex gap-1">
          {["Фото", "Анализ", "Стили", "Подбор"].map((label, i) => (
            <div key={label} className="flex-1 text-center">
              <div
                className="h-1 rounded-full mb-1 transition-colors"
                style={{
                  backgroundColor:
                    i <= Math.min(stepIndex, 3) ? `hsl(${accentColor})` : "hsl(var(--muted))",
                }}
              />
              <span className="text-[10px] text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Upload */}
        {step === "upload" && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="px-4 py-4 space-y-4"
          >
            <div className="text-center">
              <h2 className="text-lg font-bold mb-1">Загрузите фото образа</h2>
              <p className="text-sm text-muted-foreground">
                AI проанализирует ваш стиль и подберёт идеальный гардероб
              </p>
            </div>

            {/* Upload zone */}
            <div className="glass-card p-6 text-center border-2 border-dashed border-muted-foreground/20">
              <Camera className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">Сделайте фото или загрузите</p>
              <Button variant="outline" size="sm" className="gap-2">
                <Upload className="w-4 h-4" /> Загрузить фото
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">Или выберите пример:</p>

            <div className="grid grid-cols-3 gap-3">
              {WARDROBE_PHOTOS.map((photo) => (
                <motion.div
                  key={photo.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => startAnalysis(photo.id)}
                  className="cursor-pointer rounded-xl overflow-hidden relative aspect-[3/4] group"
                >
                  <img src={photo.image} alt={photo.label} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <p className="absolute bottom-2 left-2 right-2 text-[10px] text-white font-medium">
                    {photo.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2: Analyzing */}
        {step === "analyzing" && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-4 py-12 flex flex-col items-center gap-6"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            >
              <Sparkles className="w-16 h-16" style={{ color: `hsl(${accentColor})` }} />
            </motion.div>
            <div className="text-center space-y-2">
              <h2 className="text-lg font-bold">AI анализирует ваш стиль</h2>
              <p className="text-sm text-muted-foreground">
                Определяем цветотип, пропорции и стиль...
              </p>
            </div>
            <div className="w-full max-w-xs">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-center text-muted-foreground mt-2">{progress}%</p>
            </div>
          </motion.div>
        )}

        {/* Step 3: Analysis result */}
        {step === "analysis" && (
          <motion.div
            key="analysis"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="px-4 py-4 space-y-4"
          >
            <h2 className="text-lg font-bold">Ваш стиль-профиль</h2>

            {/* Profile cards */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Тип фигуры", value: MOCK_ANALYSIS.bodyType },
                { label: "Цветотип", value: MOCK_ANALYSIS.colorType },
                { label: "Стиль", value: MOCK_ANALYSIS.currentStyle },
              ].map((item) => (
                <div
                  key={item.label}
                  className="glass-card p-3 text-center"
                  style={{ borderTop: `3px solid hsl(${accentColor})` }}
                >
                  <p className="text-[10px] text-muted-foreground mb-1">{item.label}</p>
                  <p className="text-xs font-bold">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Strengths */}
            <div className="glass-card p-4">
              <h3 className="text-sm font-bold mb-2 flex items-center gap-2">
                <span className="text-green-500">✓</span> Что у вас хорошо
              </h3>
              <ul className="space-y-1">
                {MOCK_ANALYSIS.strengths.map((s) => (
                  <li key={s} className="text-xs text-muted-foreground flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span> {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations */}
            <div className="glass-card p-4">
              <h3 className="text-sm font-bold mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4" style={{ color: `hsl(${accentColor})` }} /> Рекомендации AI
              </h3>
              <ul className="space-y-1">
                {MOCK_ANALYSIS.recommendations.map((r) => (
                  <li key={r} className="text-xs text-muted-foreground flex items-start gap-2">
                    <span style={{ color: `hsl(${accentColor})` }} className="mt-0.5">→</span> {r}
                  </li>
                ))}
              </ul>
            </div>

            <Button
              className="w-full gap-2"
              style={{ backgroundColor: `hsl(${accentColor})` }}
              onClick={() => setStep("looks")}
            >
              Подобрать образы <ChevronRight className="w-4 h-4" />
            </Button>
          </motion.div>
        )}

        {/* Step 4: Choose look */}
        {step === "looks" && (
          <motion.div
            key="looks"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="px-4 py-4 space-y-4"
          >
            <h2 className="text-lg font-bold">Выберите стиль</h2>
            <p className="text-sm text-muted-foreground">AI подберёт товары с Wildberries</p>

            <div className="space-y-3">
              {STYLE_LOOKS.map((lookItem, index) => (
                <motion.div
                  key={lookItem.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => selectLook(lookItem.id)}
                  className="glass-card overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <div className="flex gap-3 p-3">
                    <img
                      src={lookItem.image}
                      alt={lookItem.name}
                      className="w-20 h-24 rounded-lg object-cover"
                    />
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="text-sm font-bold">{lookItem.name}</h3>
                      <p className="text-xs text-muted-foreground mb-2">{lookItem.desc}</p>
                      <div className="flex items-center gap-1">
                        {lookItem.products.slice(0, 3).map((p) => (
                          <img
                            key={p.id}
                            src={p.image}
                            alt={p.name}
                            className="w-8 h-8 rounded object-cover border border-border"
                          />
                        ))}
                        <span className="text-[10px] text-muted-foreground ml-1">
                          +{lookItem.products.length} товаров
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground self-center" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 5: Product cards */}
        {step === "result" && look && (
          <motion.div
            key="result"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="px-4 py-4 space-y-4"
          >
            <div>
              <h2 className="text-lg font-bold">{look.name}</h2>
              <p className="text-sm text-muted-foreground">{look.desc}</p>
            </div>

            {/* Look preview */}
            <div className="relative rounded-xl overflow-hidden aspect-[4/5]">
              <img src={look.image} alt={look.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-white text-sm font-bold mb-1">Образ подобран AI-стилистом</p>
                <p className="text-white/70 text-xs">Все товары доступны на Wildberries</p>
              </div>
            </div>

            {/* Product cards */}
            <h3 className="text-sm font-bold">Товары для образа</h3>
            <div className="grid grid-cols-2 gap-3">
              {look.products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="glass-card overflow-hidden"
                >
                  <div className="relative aspect-[3/4]">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    {product.tag && (
                      <Badge
                        className="absolute top-2 left-2 text-[10px]"
                        style={{ backgroundColor: `hsl(${accentColor})`, color: "white" }}
                      >
                        {product.tag}
                      </Badge>
                    )}
                    <motion.button
                      whileTap={{ scale: 0.8 }}
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 flex items-center justify-center"
                    >
                      <Heart
                        className="w-4 h-4"
                        fill={favorites.has(product.id) ? `hsl(${accentColor})` : "none"}
                        color={favorites.has(product.id) ? `hsl(${accentColor})` : "#666"}
                      />
                    </motion.button>
                  </div>
                  <div className="p-2">
                    <p className="text-[10px] text-muted-foreground">{product.brand}</p>
                    <p className="text-xs font-medium line-clamp-1">{product.name}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-[10px]">{product.rating}</span>
                      <span className="text-[10px] text-muted-foreground">({product.reviews})</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-bold">{product.price.toLocaleString()} ₽</span>
                      {product.oldPrice && (
                        <span className="text-xs text-muted-foreground line-through">
                          {product.oldPrice.toLocaleString()} ₽
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Total */}
            <div className="glass-card p-4" style={{ borderLeft: `4px solid hsl(${accentColor})` }}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Стоимость образа:</span>
                <div className="text-right">
                  <span className="text-lg font-bold">{totalPrice.toLocaleString()} ₽</span>
                  {totalOldPrice > totalPrice && (
                    <span className="text-xs text-muted-foreground line-through ml-2">
                      {totalOldPrice.toLocaleString()} ₽
                    </span>
                  )}
                </div>
              </div>
              {totalOldPrice > totalPrice && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-[10px]" style={{ color: `hsl(${accentColor})` }}>
                    Экономия {(totalOldPrice - totalPrice).toLocaleString()} ₽
                  </Badge>
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="space-y-2 pb-6">
              <Button
                className="w-full gap-2"
                style={{ backgroundColor: `hsl(${accentColor})` }}
                onClick={() => navigate("/chat?service=stylist&prompt=" + encodeURIComponent("Помоги подобрать образ и стиль для меня"))}
              >
                <Sparkles className="w-4 h-4" /> Обсудить с AI-стилистом
              </Button>
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() => window.open("https://www.wildberries.ru", "_blank")}
              >
                <ShoppingBag className="w-4 h-4" /> Открыть на Wildberries
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
