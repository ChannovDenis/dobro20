import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Upload, Camera, Check, AlertTriangle,
  RotateCcw, Scale, ScanSearch, ShieldCheck, Receipt,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { API } from "@/config/api";
import { useTenantTheme } from "@/config/themes";

// --- Types ---

type ScanStatus = "idle" | "uploading" | "result" | "error";
type DocType = "receipt" | "estimate";

interface AnalysisItem {
  name: string;
  receipt_price: number;
  market_price: number;
  difference: number;
}

interface AnalysisResult {
  verdict: "DISCREPANCY" | "CORRECT";
  items: AnalysisItem[];
  totals: {
    overpayment: number;
    receipt_total?: number;
    market_total?: number;
  };
  cta: {
    text: string;
    action: string;
  };
}

// --- Component ---

export default function Scan() {
  const navigate = useNavigate();
  const theme = useTenantTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [status, setStatus] = useState<ScanStatus>("idle");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<DocType>("receipt");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleReset = useCallback(() => {
    setStatus("idle");
    setResult(null);
    setError(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [previewUrl]);

  const handleFileSelect = useCallback(async (file: File) => {
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
    setStatus("uploading");
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("skin", "b2c");
      formData.append("doc_type", activeTab === "receipt" ? "receipt" : "estimate");

      const response = await fetch(`${API.dobroschyot}/api/dobroschyot/analyze`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
      }

      const data: AnalysisResult = await response.json();
      setResult(data);
      setStatus("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Неизвестная ошибка");
      setStatus("error");
    }
  }, [activeTab]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  return (
    <div className="fixed inset-0 z-50 bg-background overflow-y-auto pb-8">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Header */}
      <header className="sticky top-0 z-10 px-4 pt-4 pb-3 safe-top bg-background/80 backdrop-blur-md border-b border-border/30">
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="p-2 rounded-full text-muted-foreground hover:bg-accent transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <h1 className="text-lg font-bold text-foreground">Проверить чек или смету</h1>
        </div>
      </header>

      {/* Tabs */}
      <section className="px-4 pt-4">
        <Tabs
          value={activeTab}
          onValueChange={(v) => {
            setActiveTab(v as DocType);
            if (status !== "idle") handleReset();
          }}
        >
          <TabsList className="w-full">
            <TabsTrigger value="receipt" className="flex-1 gap-2">
              <Receipt className="w-4 h-4" />
              Чек из магазина
            </TabsTrigger>
            <TabsTrigger value="estimate" className="flex-1 gap-2">
              <ScanSearch className="w-4 h-4" />
              Смета на ремонт
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </section>

      {/* Main content */}
      <section className="px-4 pt-6">
        <AnimatePresence mode="wait">
          {/* IDLE — Upload zone */}
          {status === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <motion.div
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "glass-card p-8 flex flex-col items-center gap-5 cursor-pointer transition-all",
                  dragActive && "ring-2 ring-primary border-primary/50"
                )}
              >
                <div className="w-16 h-16 rounded-2xl bg-category-finance flex items-center justify-center">
                  <Camera className="w-8 h-8 text-category-finance" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-foreground mb-1">
                    {activeTab === "receipt" ? "Сфотографируйте чек" : "Сфотографируйте смету"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {theme.strings.scanSubtitle}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Upload className="w-4 h-4" />
                  <span>Или перетащите файл сюда</span>
                </div>
              </motion.div>

              {/* How it works */}
              <div className="mt-6 space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground">Как это работает</h3>
                {[
                  { step: "1", text: "Сфотографируйте чек или загрузите файл" },
                  { step: "2", text: "AI распознает позиции и цены" },
                  { step: "3", text: "Сравнит с рыночными ценами и покажет переплату" },
                ].map((item) => (
                  <div key={item.step} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {item.step}
                    </div>
                    <p className="text-sm text-foreground">{item.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* UPLOADING — Loading */}
          {status === "uploading" && (
            <motion.div
              key="uploading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass-card p-8 flex flex-col items-center gap-4"
            >
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-24 h-24 rounded-xl object-cover mb-2 opacity-60"
                />
              )}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              >
                <ShieldCheck className="w-12 h-12 text-primary" />
              </motion.div>
              <p className="font-semibold text-foreground">Анализируем...</p>
              <p className="text-sm text-muted-foreground text-center">
                Проверяем цены по рыночным данным
              </p>
            </motion.div>
          )}

          {/* RESULT — DISCREPANCY */}
          {status === "result" && result?.verdict === "DISCREPANCY" && (
            <motion.div
              key="discrepancy"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Overpayment banner */}
              <div className="glass-card p-6 border border-destructive/30">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-xl bg-destructive/20 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-destructive" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Обнаружена переплата</p>
                    <p className="text-2xl font-bold text-destructive">
                      +{result.totals.overpayment?.toLocaleString("ru-RU")}₽
                    </p>
                  </div>
                </div>
              </div>

              {/* Items table */}
              {result.items.length > 0 && (
                <div className="glass-card p-4">
                  <h3 className="font-semibold text-foreground mb-3">Детали по позициям</h3>
                  <div className="space-y-0">
                    {/* Header row */}
                    <div className="flex justify-between text-xs text-muted-foreground pb-2 border-b border-border/30">
                      <span>Позиция</span>
                      <div className="flex gap-6">
                        <span className="w-16 text-right">Чек</span>
                        <span className="w-16 text-right">Рынок</span>
                        <span className="w-14 text-right">Разница</span>
                      </div>
                    </div>
                    {result.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center text-sm py-2.5 border-b border-border/10 last:border-0"
                      >
                        <span className="text-foreground flex-1 pr-2 truncate">{item.name}</span>
                        <div className="flex gap-6 flex-shrink-0">
                          <span className="w-16 text-right text-muted-foreground">
                            {item.receipt_price?.toLocaleString("ru-RU")}₽
                          </span>
                          <span className="w-16 text-right text-muted-foreground">
                            {item.market_price?.toLocaleString("ru-RU")}₽
                          </span>
                          <span className={cn(
                            "w-14 text-right font-medium",
                            item.difference > 0 ? "text-destructive" : "text-foreground"
                          )}>
                            {item.difference > 0 ? `+${item.difference.toLocaleString("ru-RU")}₽` : "OK"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <Button
                onClick={() => navigate("/services")}
                className="w-full gradient-primary"
                size="lg"
              >
                <Scale className="w-5 h-5 mr-2" />
                Получить консультацию
              </Button>

              <Button
                variant="ghost"
                onClick={handleReset}
                className="w-full"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Проверить другой
              </Button>
            </motion.div>
          )}

          {/* RESULT — CORRECT */}
          {status === "result" && result?.verdict === "CORRECT" && (
            <motion.div
              key="correct"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass-card p-8 flex flex-col items-center gap-4 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.1 }}
                className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center"
              >
                <Check className="w-8 h-8 text-green-500" />
              </motion.div>
              <h3 className="text-xl font-bold text-foreground">Цены в норме</h3>
              <p className="text-sm text-muted-foreground">
                Значительных завышений цен не обнаружено
              </p>
              <Button variant="outline" onClick={handleReset} className="mt-2">
                <RotateCcw className="w-4 h-4 mr-2" />
                Проверить другой
              </Button>
            </motion.div>
          )}

          {/* ERROR */}
          {status === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass-card p-6 border border-destructive/30 text-center"
            >
              <AlertTriangle className="w-10 h-10 text-destructive mx-auto mb-4" />
              <p className="font-semibold text-foreground mb-2">Ошибка анализа</p>
              <p className="text-sm text-muted-foreground mb-4">{error}</p>
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Попробовать ещё раз
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 text-center">
        <p className="text-xs text-muted-foreground">
          AI-анализ. Данные на серверах РФ (152-ФЗ).
        </p>
      </footer>
    </div>
  );
}
