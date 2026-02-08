
# План: Голосовые сообщения + Модальный чат без BottomNav

## Обзор изменений

1. **Исправление скроллинга в чате** — chat area не учитывает `fixed` элементы внизу
2. **Кнопка микрофона** — голосовое сообщение по Telegram-паттерну (удержание для записи)
3. **Чат как модальное окно** — без BottomNav, закрытие крестиком
4. **Сервисы как модалка** — переход с Ленты без полного перехода страницы

---

## Часть 1: Исправление скроллинга чата

**Проблема:** Chat area использует `flex-1 overflow-y-auto`, но `ChatInput` и `BottomNav` — fixed. Контент перекрывается.

**Решение:**

Файл: `src/pages/Chat.tsx`
```text
Добавить padding-bottom для учёта ChatInput (~80px) + BottomNav (~80px)
Или: сделать чат fullscreen modal без BottomNav
```

---

## Часть 2: Голосовой ввод по паттерну Telegram

**Telegram UX:**
- Когда поле ввода пустое — справа кнопка микрофона (вместо Send)
- Нажал и держишь — идёт запись
- Отпустил — отправляется голосовое сообщение (или конвертируется в текст через STT)
- Свайп влево — отмена записи

**Технические шаги:**

Файл: `src/components/chat/ChatInput.tsx`

1. Добавить состояние `isRecording`
2. Условный рендер: если `message.trim() === ""` → показать `Mic` вместо `Send`
3. Обработчики событий:
   - `onMouseDown` / `onTouchStart` → начать запись
   - `onMouseUp` / `onTouchEnd` → остановить и обработать
4. Использовать `MediaRecorder` API для записи
5. Отправить аудио на ElevenLabs STT (edge function) для транскрипции

**Новый Edge Function:**

Файл: `supabase/functions/speech-to-text/index.ts`
```text
- Принимает аудио файл (blob)
- Отправляет на ElevenLabs STT API
- Возвращает транскрибированный текст
```

**UI состояния:**
```text
┌─────────────────────────────────────────┐
│  Пустой инпут:                          │
│  [ + ] [ Напишите... ] [ 🎤 ]           │
│                                         │
│  Есть текст:                            │
│  [ + ] [ Привет... ] [ ➤ ]              │
│                                         │
│  Запись:                                │
│  [ ⏺ Запись... 0:03 ] [ 🔴 ]            │
└─────────────────────────────────────────┘
```

---

## Часть 3: Чат как модальное окно (без BottomNav)

**Идея:** Чат открывается fullscreen поверх ленты/сервисов, закрывается крестиком.

**Изменения:**

Файл: `src/pages/Chat.tsx`
```text
- Убрать <BottomNav />
- Добавить кнопку X в header для закрытия (navigate(-1) или navigate('/feed'))
- Изменить позиционирование ChatInput с bottom-20 на bottom-0 + safe-area
```

Файл: `src/components/chat/ChatInput.tsx`
```text
- Изменить fixed bottom-20 → fixed bottom-0
- Добавить safe-bottom padding
```

**Результат:**
```text
┌─────────────────────────────────────────┐
│  ✕     Добросервис AI                   │  ← Header с крестиком
├─────────────────────────────────────────┤
│                                         │
│  Сообщения чата...                      │  ← Fullscreen
│                                         │
│                                         │
├─────────────────────────────────────────┤
│  [ + ] [ Напишите... ] [ 🎤 ]           │  ← Внизу экрана
└─────────────────────────────────────────┘
```

---

## Часть 4: Сервисы как модальное окно (опционально)

**Идея:** Страница Services открывается как bottom sheet поверх Feed.

**Варианты реализации:**

1. **Sheet/Drawer** — использовать `vaul` (уже установлен) для bottom sheet
2. **Fullscreen modal** — как чат, но со списком сервисов

**Рекомендация:** Начать с fullscreen modal (как чат) — проще и консистентнее.

Файл: `src/pages/Services.tsx`
```text
- Убрать <BottomNav />
- Добавить header с крестиком для закрытия
```

---

## Структура файлов

| Файл | Изменения |
|------|-----------|
| `src/pages/Chat.tsx` | Убрать BottomNav, добавить X кнопку, fix padding |
| `src/components/chat/ChatInput.tsx` | Добавить микрофон, изменить позицию на bottom-0 |
| `src/pages/Services.tsx` | Убрать BottomNav, добавить X кнопку |
| `src/components/layout/BottomNav.tsx` | Убрать "Чат" из навигации (теперь только Лента и Сервисы) |
| `supabase/functions/speech-to-text/index.ts` | Новый: транскрипция аудио через ElevenLabs |
| `src/hooks/useVoiceRecorder.ts` | Новый: хук для записи голоса |

---

## Технические детали

### Микрофон (useVoiceRecorder hook)

```typescript
// src/hooks/useVoiceRecorder.ts
interface UseVoiceRecorderReturn {
  isRecording: boolean;
  duration: number;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<Blob | null>;
  cancelRecording: () => void;
}
```

**Логика записи:**
1. `navigator.mediaDevices.getUserMedia({ audio: true })`
2. `new MediaRecorder(stream)`
3. Сохранение chunks в массив
4. При остановке — создание Blob

### Speech-to-Text Edge Function

```typescript
// supabase/functions/speech-to-text/index.ts
// Используем ElevenLabs STT API (scribe_v2)
// Возвращает транскрибированный текст
```

**Требуется секрет:** `ELEVENLABS_API_KEY`

---

## Новая навигация

```text
До:
┌───────┬───────┬───────┐
│ Лента │  Чат  │Сервисы│
└───────┴───────┴───────┘

После:
┌───────────────────────┐
│   Лента   │  Сервисы  │  ← 2 вкладки в BottomNav
└───────────────────────┘
      ↓           ↓
   FAB чат    FAB чат      ← Floating Action Button открывает чат
```

**Или сохранить 3 вкладки, но чат открывается как overlay modal.**

---

## Результат

- Лента будет скроллиться корректно
- Микрофон позволит записывать голосовые сообщения
- Чат станет fullscreen модалкой — больше места для контента
- Сервисы (опционально) тоже станут модалкой
- UX приблизится к Telegram
