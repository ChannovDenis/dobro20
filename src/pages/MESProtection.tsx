import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Upload,
  FileText,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Download,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

type Step = "upload" | "ocr" | "audit" | "actions";

// --- Mock data ---

const DEMO_RECEIPTS = [
  { id: "moscow", label: "Квитанция — Москва", month: "Январь 2026" },
  { id: "spb", label: "Квитанция — СПб", month: "Январь 2026" },
];

const MOCK_OCR_ITEMS = [
  { name: "Отопление", amount: 4521.3, unit: "Гкал" },
  { name: "Горячая вода", amount: 1234.56, unit: "м\u00B3" },
  { name: "Холодная вода", amount: 678.9, unit: "м\u00B3" },
  { name: "Водоотведение", amount: 512.45, unit: "м\u00B3" },
  { name: "Электроэнергия", amount: 2345.67, unit: "кВт\u00B7ч" },
  { name: "Содержание и ремонт", amount: 3456.78, unit: "м\u00B2" },
  { name: "Вывоз мусора", amount: 312.5, unit: "" },
  { name: "Взнос на капремонт", amount: 890.0, unit: "м\u00B2" },
];

const MOCK_TOTAL = MOCK_OCR_ITEMS.reduce((s, i) => s + i.amount, 0);

interface AuditItem {
  name: string;
  status: "overcharge" | "ok" | "warning";
  message: string;
  savings: number;
}

const MOCK_AUDIT: AuditItem[] = [
  { name: "Отопление", status: "overcharge", message: "Завышено на 23% от региональной нормы. Средний тариф в вашем районе: 3,674 \u20BD", savings: 847 },
  { name: "Горячая вода", status: "ok", message: "В пределах нормы для вашего региона", savings: 0 },
  { name: "Холодная вода", status: "ok", message: "Соответствует тарифу", savings: 0 },
  { name: "Водоотведение", status: "ok", message: "В пределах нормы", savings: 0 },
  { name: "Электроэнергия", status: "ok", message: "Тариф актуальный, потребление среднее", savings: 0 },
  { name: "Содержание и ремонт", status: "overcharge", message: "Завышено на 15%. Проверьте протокол собрания жильцов", savings: 400 },
  { name: "Вывоз мусора", status: "warning", message: "Тариф на верхней границе нормы", savings: 0 },
  { name: "Взнос на капремонт", status: "ok", message: "Соответствует региональному минимуму", savings: 0 },
];

const TOTAL_MONTHLY_SAVINGS = MOCK_AUDIT.reduce((s, i) => s + i.savings, 0);

const COMPLAINT_TEMPLATE = `Директору ООО «УК Комфорт»
от ______________________
адрес: __________________

ПРЕТЕНЗИЯ
о перерасчёте коммунальных платежей

В соответствии с Постановлением Правительства РФ №354 от 06.05.2011, прошу произвести перерасчёт начислений за отопление и содержание жилого помещения за январь 2026 года.

Основания:
1. Начисление за отопление (4 521,30 руб.) превышает региональную норму на 23%. По действующему тарифу сумма не должна превышать 3 674 руб.
2. Тариф на содержание и ремонт (3 456,78 руб.) не соответствует утверждённому на общем собрании собственников.

Требую:
- Произвести перерасчёт за указанные услуги
- Предоставить обоснование применённых тарифов
- В случае отказа — направить мотивированный ответ в 30-дневный срок

Приложения:
1. Копия квитанции за январь 2026
2. Выписка из протокола собрания собственников

Дата: _______________
Подпись: _____________`;

function formatPrice(n: number): string {
  return n.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function MESProtection() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("upload");
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [auditProgress, setAuditProgress] = useState(0);
  const [showComplaint, setShowComplaint] = useState(false);

  const goToOCR = () => {
    setStep("ocr");
    setOcrProgress(0);
    const interval = setInterval(() => {
      setOcrProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 8;
      });
    }, 60);
    setTimeout(() => goToAudit(), 1500);
  };

  const goToAudit = () => {
    setStep("audit");
    setAuditProgress(0);
    const interval = setInterval(() => {
      setAuditProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 4;
      });
    }, 60);
    setTimeout(() => setStep("actions"), 2200);
  };

  const stepIndex = { upload: 0, ocr: 1, audit: 2, actions: 3 }[step];

  const statusIcon = (s: AuditItem["status"]) => {
    if (s === "overcharge") return <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />;
    if (s === "warning") return <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />;
    return <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />;
  };

  const statusBorder = (s: AuditItem["status"]) => {
    if (s === "overcharge") return "border-l-red-500";
    if (s === "warning") return "border-l-amber-500";
    return "border-l-green-500";
  };

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
          <h1 className="text-base font-bold text-foreground">Защита и справедливость</h1>
          <p className="text-xs text-muted-foreground">Мосэнергосервис</p>
        </div>
        <Badge
          variant="outline"
          className="text-xs"
          style={{ borderColor: "hsl(25 90% 50%)", color: "hsl(25 90% 50%)" }}
        >
          МЭС
        </Badge>
      </motion.header>

      {/* Step indicator */}
      <div className="px-4 py-3">
        <div className="flex gap-2">
          {["Загрузка", "Распознавание", "Аудит", "Результат"].map((label, i) => (
            <div key={label} className="flex-1">
              <div
                className={`h-1 rounded-full transition-colors ${
                  i <= stepIndex ? "bg-[hsl(25,90%,50%)]" : "bg-muted"
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
            <h2 className="text-lg font-bold mb-1">Загрузите квитанцию ЖКХ</h2>
            <p className="text-sm text-muted-foreground mb-4">
              AI найдёт переплаты и подготовит жалобу за 30 секунд
            </p>

            {/* Upload zone */}
            <div className="glass-card p-8 text-center mb-4 border-2 border-dashed border-muted-foreground/20 rounded-xl">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground mb-3">
                Фото квитанции, PDF или скриншот
              </p>
              <Button variant="outline" size="sm" className="gap-2">
                <Upload className="w-4 h-4" /> Загрузить
              </Button>
            </div>

            {/* Demo receipts */}
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              Или выберите демо-квитанцию
            </h3>
            <div className="space-y-2">
              {DEMO_RECEIPTS.map((r) => (
                <motion.div
                  key={r.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedReceipt(r.id)}
                  className={`glass-card p-4 flex items-center gap-3 cursor-pointer transition-all ${
                    selectedReceipt === r.id
                      ? "ring-2 ring-[hsl(25,90%,50%)] ring-offset-2 ring-offset-background"
                      : ""
                  }`}
                >
                  <FileText className="w-8 h-8 text-[hsl(25,90%,50%)]" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{r.label}</p>
                    <p className="text-xs text-muted-foreground">{r.month}</p>
                  </div>
                  {selectedReceipt === r.id && (
                    <CheckCircle2 className="w-5 h-5 text-[hsl(25,90%,50%)]" />
                  )}
                </motion.div>
              ))}
            </div>

            <Button
              className="w-full mt-6 gap-2"
              style={{ backgroundColor: "hsl(25 90% 50%)" }}
              disabled={!selectedReceipt}
              onClick={goToOCR}
            >
              <ShieldCheck className="w-4 h-4" /> Проверить квитанцию
            </Button>
          </motion.div>
        )}

        {step === "ocr" && (
          <motion.div
            key="ocr"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="px-4 pb-8"
          >
            <div className="glass-card p-6 text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-[hsl(25,90%,50%)] border-t-transparent"
              />
              <h2 className="text-lg font-bold mb-2">Распознаём квитанцию...</h2>
              <p className="text-sm text-muted-foreground mb-4">OCR-анализ начислений</p>
              <Progress value={ocrProgress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">{ocrProgress}%</p>
            </div>
          </motion.div>
        )}

        {step === "audit" && (
          <motion.div
            key="audit"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="px-4 pb-8"
          >
            {/* OCR Results */}
            <div className="glass-card p-4 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-[hsl(25,90%,50%)]" />
                <h3 className="text-sm font-bold">Распознанные начисления</h3>
              </div>
              <div className="space-y-1">
                {MOCK_OCR_ITEMS.map((item) => (
                  <div key={item.name} className="flex justify-between text-xs py-1 border-b border-border/50 last:border-0">
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="font-medium">{formatPrice(item.amount)} \u20BD</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm pt-2 font-bold">
                  <span>Итого</span>
                  <span>{formatPrice(MOCK_TOTAL)} \u20BD</span>
                </div>
              </div>
            </div>

            {/* Audit in progress */}
            <div className="glass-card p-6 text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="w-12 h-12 mx-auto mb-3 rounded-full border-4 border-[hsl(25,90%,50%)] border-t-transparent"
              />
              <h3 className="text-base font-bold mb-1">AI проверяет тарифы...</h3>
              <p className="text-xs text-muted-foreground mb-3">
                Сравниваем с региональными нормами
              </p>
              <Progress value={auditProgress} className="h-2" />
            </div>
          </motion.div>
        )}

        {step === "actions" && (
          <motion.div
            key="actions"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="px-4 pb-8"
          >
            {/* Savings banner */}
            <div
              className="rounded-xl p-4 mb-4 text-white"
              style={{ backgroundColor: "hsl(25 90% 50%)" }}
            >
              <div className="flex items-center gap-2 mb-1">
                <TrendingDown className="w-5 h-5" />
                <span className="text-sm font-medium">Найдены переплаты</span>
              </div>
              <p className="text-2xl font-bold">{formatPrice(TOTAL_MONTHLY_SAVINGS)} \u20BD / мес</p>
              <p className="text-sm opacity-80">
                ~{formatPrice(TOTAL_MONTHLY_SAVINGS * 12)} \u20BD в год
              </p>
            </div>

            {/* Audit details */}
            <h3 className="text-sm font-bold mb-3">Детальный аудит</h3>
            <div className="space-y-2 mb-4">
              {MOCK_AUDIT.map((item) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`glass-card p-3 border-l-4 ${statusBorder(item.status)}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {statusIcon(item.status)}
                    <span className="text-sm font-medium flex-1">{item.name}</span>
                    {item.savings > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        -{formatPrice(item.savings)} \u20BD
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground ml-6">{item.message}</p>
                </motion.div>
              ))}
            </div>

            {/* CTAs */}
            <div className="space-y-3">
              <Button
                className="w-full gap-2"
                style={{ backgroundColor: "hsl(25 90% 50%)" }}
                onClick={() => setShowComplaint(true)}
              >
                <Download className="w-4 h-4" /> Сгенерировать жалобу
              </Button>
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() => navigate("/chat?service=finance")}
              >
                <Sparkles className="w-4 h-4" /> Обсудить с AI-помощником
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setStep("upload");
                  setSelectedReceipt(null);
                }}
              >
                Проверить другую квитанцию
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Complaint modal */}
      <AnimatePresence>
        {showComplaint && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[100] flex items-end justify-center"
            onClick={() => setShowComplaint(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-background rounded-t-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-background/90 backdrop-blur-lg p-4 border-b border-border flex items-center justify-between">
                <h3 className="font-bold">Шаблон жалобы</h3>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowComplaint(false)}
                  className="p-1 rounded-full hover:bg-muted"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
              <div className="p-4">
                <pre className="text-xs whitespace-pre-wrap font-mono bg-muted/50 p-4 rounded-lg leading-relaxed">
                  {COMPLAINT_TEMPLATE}
                </pre>
                <div className="flex gap-2 mt-4">
                  <Button className="flex-1 gap-2" variant="outline">
                    <Download className="w-4 h-4" /> Скачать .docx
                  </Button>
                  <Button
                    className="flex-1 gap-2"
                    style={{ backgroundColor: "hsl(25 90% 50%)" }}
                    onClick={() => {
                      navigator.clipboard.writeText(COMPLAINT_TEMPLATE);
                      setShowComplaint(false);
                    }}
                  >
                    Копировать
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
