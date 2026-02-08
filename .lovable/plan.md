
# План: Исправление ошибок чата и сервисов

## Проблема 1: Крестик закрытия требует 2 клика

**Причина:** Комбинация `navigate(-1)` с framer-motion. При первом клике animation может перехватывать событие.

**Решение:**
- Заменить `navigate(-1)` на `navigate('/feed')` — детерминированный путь
- Добавить `e.stopPropagation()` в обработчик клика
- Использовать нативный `<button>` вместо `<Button>` с motion wrapper

**Файлы:**
- `src/pages/Chat.tsx` — исправить кнопку X
- `src/pages/Services.tsx` — исправить кнопку X

---

## Проблема 2: История чата не сохраняется

**Причина:** `useChat` хранит сообщения в `useState`, которое сбрасывается при размонтировании компонента (переход на другую страницу).

**Решение (демо-версия):** Использовать localStorage для сохранения истории чата между визитами.

**Файл:** `src/hooks/useChat.ts`

Изменения:
1. При инициализации — загружать сообщения из localStorage
2. При добавлении сообщения — сохранять в localStorage
3. Добавить функцию `clearHistory()` для очистки

```text
Логика:
const STORAGE_KEY = 'dobro-chat-history';

// Инициализация
const [messages, setMessages] = useState<Message[]>(() => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
});

// Сохранение при изменении
useEffect(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}, [messages]);
```

---

## Проблема 3: Кнопки в Services не все работают

**Текущие неработающие кнопки:**

| Кнопка | Действие (демо) |
|--------|-----------------|
| Сканер (QrCode) | toast: "Сканер QR-кодов скоро будет доступен" |
| Оплата (CreditCard) | toast: "Раздел оплаты в разработке" |
| Кэшбэк (Percent) | toast: "Кэшбэк-программа запускается" |
| Бонусы (Star) | toast: "Бонусная программа скоро" |
| Активировать (Premium) | toast: "Премиум активирован на 30 дней" |
| Поделиться (Referral) | navigator.share() или копирование ссылки |
| Кнопки "Все" | navigate(`/services?category=${id}`) |
| Bell (уведомления) | toast: "Уведомлений нет" |

**Файл:** `src/pages/Services.tsx`

---

## Структура изменений

| Файл | Изменения |
|------|-----------|
| `src/pages/Chat.tsx` | Исправить X: `navigate('/feed')` + stopPropagation |
| `src/pages/Services.tsx` | Исправить X + добавить обработчики quickActions, promotions, bell |
| `src/hooks/useChat.ts` | Добавить localStorage для истории чата |

---

## Техническая реализация

### Chat.tsx — Исправление крестика

```typescript
const handleClose = (e: React.MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  navigate('/feed');
};

<button
  type="button"
  onClick={handleClose}
  className="p-2 rounded-full text-muted-foreground hover:bg-accent"
>
  <X className="w-5 h-5" />
</button>
```

### useChat.ts — Сохранение истории

```typescript
const STORAGE_KEY = 'dobro-chat-history';

const [messages, setMessages] = useState<Message[]>(() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
});

useEffect(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}, [messages]);

const clearHistory = useCallback(() => {
  setMessages([]);
  localStorage.removeItem(STORAGE_KEY);
}, []);
```

### Services.tsx — Обработчики кнопок

```typescript
import { toast } from "sonner";

const handleQuickAction = (id: string) => {
  switch (id) {
    case "scan":
      toast.info("🔍 Сканер QR-кодов скоро будет доступен");
      break;
    case "pay":
      toast.info("💳 Раздел оплаты в разработке");
      break;
    case "cashback":
      toast.info("💰 Кэшбэк-программа запускается скоро");
      break;
    case "bonus":
      toast.info("⭐ Бонусная программа скоро");
      break;
  }
};

const handlePromoAction = (id: string) => {
  switch (id) {
    case "premium":
      toast.success("🎉 Премиум активирован на 30 дней!");
      break;
    case "referral":
      if (navigator.share) {
        navigator.share({
          title: "Добросервис",
          text: "Присоединяйся и получи бонус!",
          url: window.location.origin,
        });
      } else {
        navigator.clipboard.writeText(window.location.origin);
        toast.success("📋 Ссылка скопирована!");
      }
      break;
  }
};

const handleBellClick = () => {
  toast.info("🔔 У вас пока нет новых уведомлений");
};
```

---

## Результат

- Крестик будет закрывать модалку с первого клика
- История чата сохраняется в localStorage между сессиями
- Все кнопки в Services дают обратную связь (toast/action)
- UX становится более отзывчивым и понятным
