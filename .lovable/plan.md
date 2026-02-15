

# Добросервис 2.0 — Структурные изменения

## Обзор

Четыре связанных изменения: новый экран "Мои консультации", навигация 4 таба, реальные данные в ProfileHeader, и навигация назад в чате.

---

## 1. Новый экран `/chats` — "Мои консультации"

**Новый файл:** `src/pages/Chats.tsx`

Полноценный экран со списком всех топиков пользователя:
- Хедер: "Мои консультации" + кнопка "+" (Plus)
- Поиск: Input с иконкой Search, фильтрация по имени ассистента и тексту последнего сообщения
- Чипсы-фильтры: Все / Активные / Архив / С экспертом (горизонтальный scroll)
- Список топиков из БД через `useTopics()` с дополнительным запросом последних сообщений
- Карточки: иконка ассистента (из `AI_ASSISTANTS`), имя, последнее сообщение (truncate), относительное время, badge "Эксперт" для escalated
- Тап по карточке: navigate(`/chat?topicId=...`)
- Пустое состояние: иконка MessageSquare + кнопка "Задать первый вопрос"
- BottomNav внизу

**Новый файл:** `src/components/chat/NewConsultationSheet.tsx`

Sheet (vaul Drawer) с сеткой ассистентов (4 колонки):
- Все уникальные ассистенты из `AI_ASSISTANTS` (без дубликатов wellness/style)
- Каждый: круглая иконка 48x48 + имя (text-xs)
- Тап: navigate(`/chat?service=...`), Sheet закрывается

**Изменение:** `src/App.tsx` — добавить Route `/chats`

---

## 2. BottomNav: 4 таба

**Изменение:** `src/components/layout/BottomNav.tsx`

Новая структура:
- Таб 1: Home, "Лента", /feed
- Таб 2: MessageCircle, "Чаты", /chats
- Таб 3: Bot — центральная приподнятая кнопка (gradient-primary, -mt-6, без label), /chat
- Таб 4: LayoutGrid, "Сервисы", /services

Убрать `activeFeedItem` prop и связанную с ним логику — теперь кнопка "Чат" всегда ведёт на /chat.

**Изменения в родительских страницах:**
- `src/pages/Feed.tsx` — убрать `activeFeedItem` state и prop из BottomNav
- Все страницы, использующие BottomNav, получат обновлённый компонент автоматически

---

## 3. ProfileHeader и Services — убрать моки

**Изменение:** `src/components/settings/ProfileHeader.tsx`
- Убрать `import { userProfile }` из mockData
- Использовать `useProfile()` для получения `display_name` из БД
- Fallback: "Пользователь" вместо "Денис Чаннов"
- Avatar fallback: первая буква имени
- Подписку "Премиум" оставить как есть

**Изменение:** `src/pages/Services.tsx`
- Убрать `userProfile` из импорта mockData (оставить `services`)
- Использовать `useProfile()` для имени в хедере
- Fallback: "Пользователь"

**Изменение:** `src/components/layout/TopBar.tsx`
- Аналогично убрать `userProfile`, использовать `useProfile()`

---

## 4. Chat: навигация назад

**Изменение:** `src/pages/Chat.tsx`
- Заменить иконку `X` на `ArrowLeft`
- `handleClose`: navigate('/chats') вместо navigate('/feed')
- `handleDelete`: navigate('/chats') вместо navigate('/feed')

---

## Файлы для изменения

| Файл | Действие |
|------|----------|
| `src/pages/Chats.tsx` | Создать |
| `src/components/chat/NewConsultationSheet.tsx` | Создать |
| `src/components/layout/BottomNav.tsx` | Переписать (4 таба) |
| `src/pages/Feed.tsx` | Упростить (убрать activeFeedItem) |
| `src/components/settings/ProfileHeader.tsx` | useProfile() вместо mockData |
| `src/pages/Services.tsx` | useProfile() вместо mockData для хедера |
| `src/components/layout/TopBar.tsx` | useProfile() вместо mockData |
| `src/pages/Chat.tsx` | ArrowLeft, navigate('/chats') |
| `src/App.tsx` | Добавить Route /chats |

## Что НЕ трогаем

- Edge Functions, AI-логику, SSE-стриминг
- Авторизацию
- Темизацию
- Feed-карточки
- useTopics.ts, useChat.ts, useProfile.ts — логика не меняется

