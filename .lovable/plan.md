

# Аудит клиентского приложения Добросервис

## 1. МАРШРУТЫ

| Маршрут | Компонент | Статус | Описание функционала |
|---------|-----------|--------|----------------------|
| `/` | Navigate → `/splash` | Готов | Редирект на сплэш-экран |
| `/splash` | SplashScreen | Готов | Анимированный экран загрузки с лого (2 сек) |
| `/feed` | Feed | Готов | TikTok-style лента контента с вертикальным скроллом |
| `/chat` | Chat | Готов | AI-чат с Лизой (стилист) и универсальным ассистентом |
| `/services` | Services | Готов | Хаб сервисов в стиле super-app |
| `/settings` | Settings | Готов | Профиль пользователя и настройки |
| `/service/:id` | ServiceDetail | Готов | Список экспертов по категории |
| `/service/:id/expert/:expertId` | ExpertDetail | Готов | Карточка эксперта с записью |
| `/mini-app/:id` | MiniApp | Placeholder | Заглушка для мини-приложений |
| `/admin` | Admin | Готов | Панель партнёра с метриками (требует авторизации) |
| `*` | NotFound | Готов | Страница 404 |

**Отсутствующие экраны:**
- Онбординг / выбор сервисов
- Видеозвонок с экспертом
- История консультаций
- Авторизация / регистрация

---

## 2. LAYOUT

### Навигация
- **BottomNav** - нижняя панель с 3 табами:
  - Лента (`/feed`) - иконка Home
  - Чат (`/chat`) - центральная кнопка с градиентом, эффект glow
  - Сервисы (`/services`) - иконка Grid3X3
- Кнопка чата выделена визуально (выступает над панелью на -mt-6)
- Контекстная передача: при клике на "Чат" из ленты - передаётся контекст текущего поста

### Структура экранов
- **SplashScreen**: полноэкранный, без навигации
- **Feed**: TikTok-style 100dvh с BottomNav
- **Chat/Services/Settings**: модальные экраны (кнопка X для закрытия)
- **ServiceDetail/ExpertDetail/Admin**: стандартные страницы с header (стрелка назад)

### Переходы
- React Router v6 с `Navigate`, `useNavigate`, `useParams`
- Анимации через Framer Motion (fade, scale, slide)

---

## 3. ЭКРАНЫ

### 3.1 SplashScreen (`/splash`)
| Секция | Описание |
|--------|----------|
| Logo | Анимированная иконка Bot с gradient-primary и glow |
| Title | "ДОБРОСЕРВИС" с glow-text эффектом |
| Subtitle | "Эксперты и AI в одном приложении" |
| Loader | 3 точки с пульсирующей анимацией |
| **Mock-данные** | Нет |
| **Интерактивность** | Автопереход на /feed через 2 сек |

### 3.2 Feed (`/feed`)
| Секция | Компонент | Описание |
|--------|-----------|----------|
| TikTok-лента | TikTokFeed | Вертикальный snap-scroll на 100dvh |
| Карточки контента | FeedCard | Изображение/видео + overlay с заголовком |
| Промо-карточки | PromoCard | CTA для перехода к сервисам |
| Навигация | BottomNav | Нижние табы |

**Mock-данные:** `feedItems` (15 карточек), включая садовые советы, ЗОЖ, безопасность, финансы
**Интерактивность:**
- Свайп вверх/вниз (snap scroll)
- Лайк (локальный state)
- Mute/unmute видео
- Кнопка "К эксперту" → переход на /service/:id
- Share (toast "скоро")

### 3.3 Chat (`/chat`)
| Секция | Компонент | Описание |
|--------|-----------|----------|
| Header | - | Название AI-ассистента + кнопка закрытия |
| Empty state | SuggestionTicker | Бегущие строки с подсказками (18 вариантов) |
| Messages | ChatMessage | Сообщения с Markdown, кнопками действий |
| Input | ChatInput | Текст + голос + загрузка фото |
| Templates | TemplatesModal | Готовые промпты по категориям |

**Mock-данные:** `chatTemplates`, `quickActions`, `TRENDS_2026`
**Интерактивность:**
- Отправка сообщений → Edge Function `lisa-stylist`
- Голосовой ввод (демо-режим, без реального распознавания)
- Загрузка фото для анализа цветотипа
- Action buttons: примерка, цветотип, тренды
**Особенности:**
- Streaming SSE ответов
- Сохранение истории в localStorage
- Контекст из URL params (?context=, ?prompt=)

### 3.4 Services (`/services`)
| Секция | Компонент | Описание |
|--------|-----------|----------|
| Header | - | Аватар + имя + колокольчик + настройки |
| Промо-карусель | - | "Премиум 30 дней", "Пригласи друга" |
| Quick actions | - | Сканер, Оплата, Кэшбэк, Бонусы (все - заглушки) |
| AI-ассистент | - | Промо-блок → /chat |
| Категории | - | Сезонное, Популярное, Финансы, Образ жизни |
| Активность | - | Статистика (12 консультаций, 2340р сэкономлено) |

**Mock-данные:** `services` (12 сервисов), `userProfile`, `promotions`, `quickActions`, `categories`
**Интерактивность:**
- Клик на сервис → /service/:id
- Промо-кнопки → toast с сообщениями
- Quick actions → toast "в разработке"

### 3.5 Settings (`/settings`)
| Секция | Компонент | Описание |
|--------|-----------|----------|
| ProfileHeader | ProfileHeader | Аватар, имя, статус подписки |
| SuperAppGrid | SuperAppGrid | 12 иконок сервисов (4x3) |
| Accordion секции | SettingsSection | Подписка, Уведомления, Безопасность, Тема, Партнёрам, Приложение, О приложении |
| ThemeSwitcher | ThemeSwitcher | Выбор темы: Dobro/GPB/WB |
| Social | - | Instagram, Telegram |
| Logout | - | Кнопка выхода (не работает) |

**Mock-данные:** `userProfile`, `superAppItems`
**Интерактивность:**
- Переключение тем (меняет CSS-переменные)
- Переключатели уведомлений (локальный state)
- Навигация к /admin
- Остальные пункты - неактивны

### 3.6 ServiceDetail (`/service/:id`)
| Секция | Описание |
|--------|----------|
| Header | Навигация + название сервиса |
| Hero | Иконка + описание на градиенте |
| Filters | "Все" / "Онлайн" / "Топ рейтинг" |
| Expert cards | Карточки экспертов с рейтингом, опытом, ценой |

**Mock-данные:** `services`, `experts` (4 категории: garden, lawyer, doctor, psychologist)
**Интерактивность:**
- Фильтрация экспертов
- Клик на эксперта → /service/:id/expert/:expertId
- "Записаться" / "Сейчас" → та же страница

### 3.7 ExpertDetail (`/service/:id/expert/:expertId`)
| Секция | Описание |
|--------|----------|
| Avatar + bio | Информация об эксперте |
| Stats | Опыт, консультации, рейтинг |
| Communication icons | Телефон, видео, чат, документы (неактивны) |
| Date picker | 7 дней вперёд |
| Time slots | Слоты из mock-данных |
| Consultation type | Онлайн / Чат с разными ценами |
| CTA | "Записаться" с ценой |

**Mock-данные:** `experts`
**Интерактивность:**
- Выбор даты и времени
- Выбор типа консультации
- Кнопка "Записаться" → alert() → navigate(-1)

### 3.8 MiniApp (`/mini-app/:id`)
| Секция | Описание |
|--------|----------|
| Header | Иконка + название |
| Card | Иконка, описание, "Powered by AI" |
| Features | Список возможностей |

**Mock-данные:** `miniApps` (4 приложения: калории, документы, бюджет, симптомы)
**Интерактивность:**
- "Открыть в чате" → /chat
- "Назад" → navigate(-1)
- **Статус:** Placeholder - реальной функциональности нет

### 3.9 Admin (`/admin`)
| Секция | Компонент | Описание |
|--------|-----------|----------|
| Header | - | "Панель партнёра" + название тенанта |
| MetricsGrid | MetricsGrid | DAU, AI-обращения, Записи, Конверсия |
| ActivityChart | ActivityChart | Recharts AreaChart за неделю |
| TopServicesTable | TopServicesTable | Популярные сервисы |
| RecentEscalations | RecentEscalations | Последние эскалации |

**Mock-данные:** Захардкожены в компонентах
**Интерактивность:**
- Требует авторизации (useAdminAuth)
- Редирект неавторизованных на /
- Показ "Доступ запрещён" для пользователей без роли

---

## 4. ОБЩИЕ КОМПОНЕНТЫ

### UI-компоненты (shadcn/ui)
| Компонент | Использование |
|-----------|---------------|
| Avatar | Профили, эксперты, авторы |
| Button | CTA, действия |
| Switch | Настройки уведомлений |
| Accordion | Секции настроек |
| Dialog/Drawer | Модальные окна |

### Кастомные компоненты

#### Layout
- **BottomNav** - нижняя навигация с 3 табами
- **TopBar** - (не используется)
- **SearchBar** - (не используется)

#### Chat
- **ChatMessage** - рендер сообщения с Markdown
- **ChatInput** - ввод + голос + фото
- **SuggestionTicker** - бегущие строки подсказок
- **ActionButtons** - кнопки действий в чате
- **ColorPalette** - отображение цветотипа
- **TrendGallery** - галерея трендов
- **ImageUploader** - загрузка фото
- **TemplatesModal** - готовые промпты

#### Feed
- **TikTokFeed** - контейнер с snap-scroll
- **FeedCard** - карточка контента
- **PromoCard** - промо-карточка сервиса
- **ServiceGrid** - сетка сервисов (не используется на главных экранах)

#### Settings
- **ProfileHeader** - шапка профиля
- **SuperAppGrid** - сетка мини-приложений
- **SettingsSection** - аккордеон-секция
- **ThemeSwitcher** - переключатель тем

#### Admin
- **MetricsGrid** - сетка метрик
- **ActivityChart** - график активности
- **TopServicesTable** - таблица сервисов
- **RecentEscalations** - эскалации

---

## 5. КОНТЕКСТЫ И STATE

### React Contexts
| Контекст | Файл | Назначение |
|----------|------|------------|
| TenantContext | `contexts/TenantContext.tsx` | Multi-tenancy: тема, AI-имя, квоты |
| QueryClient | App.tsx | React Query для кэширования |
| TooltipProvider | App.tsx | Shadcn tooltips |

### Custom Hooks
| Hook | Назначение |
|------|------------|
| `useTenant` | Доступ к конфигу тенанта |
| `useChat` | Логика чата: сообщения, streaming, actions |
| `useProfile` | Профиль пользователя из Supabase |
| `useTopics` | CRUD для топиков/сообщений в БД |
| `useAdminAuth` | Проверка admin-роли |
| `useAnalytics` | Аналитика (не используется активно) |
| `useVoiceRecorder` | Голосовой ввод (демо) |
| `use-mobile` | Определение мобильного устройства |

### Local State
- Chat history → localStorage (`dobro-chat-history`)
- Theme → URL param + CSS variables
- Session ID → localStorage (`dobro-session-id`)

---

## 6. ДИЗАЙН

### Тема
- **Режим:** Только тёмная тема (glassmorphism)
- **Фон:** `hsl(222 47% 11%)` - тёмно-синий
- **Карточки:** `glass-card` с blur эффектом
- **Акценты:** Динамические по тенанту

### Цветовые схемы тенантов
| Тенант | Primary Color |
|--------|---------------|
| Dobro (default) | `142 76% 36%` (зелёный) |
| GPB | `210 100% 35%` (синий) |
| Wildberries | `280 80% 50%` (фиолетовый) |

### Категории сервисов
```text
legal     → 199 89% 48% (голубой)
health    → 142 76% 36% (зелёный)
psychology→ 280 65% 60% (фиолетовый)
finance   → 38 92% 50%  (оранжевый)
wellness  → 350 89% 60% (розовый)
security  → 262 83% 58% (пурпурный)
vet       → 25 95% 53%  (оранжевый)
style     → 328 86% 70% (розовый)
```

### Шрифты
- **Font-family:** Inter, system-ui, sans-serif
- **Prose:** tailwindcss-typography для Markdown

### Эффекты
- `glow` - box-shadow с primary цветом
- `glass` - backdrop-filter: blur(20px)
- `gradient-primary` - linear-gradient с primary + purple
- Framer Motion анимации везде

---

## 7. ЗАВИСИМОСТИ

### Core
- React 18.3.1
- Vite 5.4.19
- TypeScript 5.8.3
- React Router DOM 6.30.1

### UI
- Tailwind CSS 3.4.17 + tailwindcss-animate
- shadcn/ui (radix-ui компоненты)
- Framer Motion 12.33.0
- Lucide React 0.462.0 (иконки)
- Recharts 2.15.4 (графики)
- react-markdown 10.1.0

### Data
- @tanstack/react-query 5.83.0
- @supabase/supabase-js 2.95.3
- zod 3.25.76
- react-hook-form 7.61.1

### Utils
- date-fns 3.6.0
- clsx, tailwind-merge
- sonner (toasts)
- vaul (drawer)

---

## 8. MOCK-ДАННЫЕ

### `src/data/mockData.ts` (471 строк)
| Объект | Количество | Описание |
|--------|------------|----------|
| services | 12 | Все сервисы Добросервиса |
| miniApps | 4 | Мини-приложения |
| feedItems | 15 | Контент для ленты |
| contentItems | 6 | Дополнительный контент |
| experts | 4 категории | Эксперты по категориям |
| userProfile | 1 | Профиль пользователя |
| chatTemplates | 6 | Шаблоны для чата |
| quickActions | 4 | Быстрые действия |
| superAppItems | 12 | Иконки для SuperAppGrid |

### `src/constants/trends.ts` (83 строки)
- `TRENDS_2026` - 8 модных трендов с изображениями

### `src/constants/chatActions.ts` (120 строк)
- Ключевые слова для style mode
- Наборы action buttons

### `src/constants/clothing.ts`
- Данные об одежде для виртуальной примерки

---

## 9. ПРОБЛЕМЫ

### Критические
| Проблема | Файл | Описание |
|----------|------|----------|
| Нет авторизации | - | Пользователи не могут войти/зарегистрироваться |
| Запись не работает | ExpertDetail.tsx | `handleBooking` → `alert()` вместо реальной записи |
| Голосовой ввод - демо | useVoiceRecorder.ts | Только таймер, нет распознавания |

### Англоязычные тексты
| Файл | Текст |
|------|-------|
| NotFound.tsx | "Oops! Page not found", "Return to Home" |

### Заглушки / неработающий функционал
| Функционал | Статус |
|------------|--------|
| Quick actions (Сканер, Оплата, Кэшбэк, Бонусы) | Toast "в разработке" |
| Communication icons (Phone, Video, Chat) | Неактивны |
| Logout button | Не реализован |
| Share buttons | Не реализованы |
| MiniApps | Placeholder без функционала |
| История консультаций | Отсутствует |
| Видеозвонок с экспертом | Отсутствует |
| Онбординг | Отсутствует |
| Сохранение записи к эксперту | Не реализовано |

### Баги навигации
- При закрытии `/services` или `/chat` - всегда переход на `/feed`, а не на предыдущую страницу

### UX проблемы
- Нет индикации загрузки при смене тенанта
- Нет empty state для списка экспертов без данных
- Нет offline mode

---

## 10. ОЦЕНКА ГОТОВНОСТИ

### Готовность к демо: **65%**

### Что работает хорошо (демо-готово):
- TikTok-style лента контента
- AI-чат с streaming и action buttons
- Визуальная часть: glassmorphism, анимации, темы
- Навигация между основными экранами
- White-label поддержка (3 тенанта)
- Карточки экспертов и запись (UI)
- Админ-панель с графиками

### Критично доделать для MVP:
1. **Авторизация** - signup/login формы, Supabase Auth
2. **Реальная запись к эксперту** - сохранение в БД
3. **История консультаций** - список записей пользователя
4. **Перевод NotFound** на русский

### Желательно для полноценного демо:
5. Онбординг / выбор интересов
6. Видеозвонок (интеграция с WebRTC)
7. Push-уведомления
8. Реальный голосовой ввод
9. Работающий logout

---

## Технические детали

### База данных (Supabase)
**Таблицы:**
- `tenants` - конфигурация тенантов
- `profiles` - профили пользователей
- `topics` - чаты/топики
- `topic_messages` - сообщения в топиках
- `user_roles` - роли (user, partner_admin, super_admin)
- `analytics_events` - события аналитики

**Views:**
- `public_tenant_info` - публичная информация о тенанте

### Edge Functions
| Функция | Назначение |
|---------|------------|
| `lisa-stylist` | AI-чат (streaming SSE через Lovable AI Gateway) |
| `colortype-analyzer` | Анализ цветотипа по фото |
| `virtual-tryon` | Виртуальная примерка |
| `chat` | Альтернативный чат endpoint |

### Архитектура
- Multi-tenant B2B2C платформа
- Tenant resolution: URL param `?tenant=` или subdomain
- RLS policies для изоляции данных
- Session-based анонимный доступ с x-session-id

