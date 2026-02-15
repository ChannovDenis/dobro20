

# Мульти-тенантность для 5 клиентов-партнёров

## Обзор

Создание клиентского конфига тенантов и интеграция во все ключевые экраны: SplashScreen, Services, NewConsultationSheet. TenantContext переключается на локальный конфиг вместо запросов к БД (которая пуста для этих тенантов).

## Изменения

### 1. Новый файл `src/config/tenants.ts`

Конфиг 6 тенантов (default + 5 партнёров) с интерфейсом `TenantConfig`:
- `id`, `slug`, `name`, `appTitle`, `appSubtitle`
- `accentColor` (HSL для --primary)
- `enabledServices` (массив slug-ов сервисов)

Все данные — из задания (Добросервис, Газпромбанк, Wildberries, Почта России, Мосэнергосервис, Альфа-Банк).

### 2. Переработка `src/contexts/TenantContext.tsx`

Текущая логика: запрос к таблице `public_tenant_info` → fallback на дефолт.

Новая логика:
- Импортировать `tenants` из `config/tenants.ts`
- При резолве slug (из `?tenant=` или поддомена) — искать в `tenants[slug]`
- Если не найден — `tenants.default`
- Заполнять `Tenant` объект из локального конфига: `appTitle`, `appSubtitle`, `enabled_services` из `enabledServices`, theme из `accentColor`
- Применять `accentColor` как `--primary` CSS-переменную (механизм `applyThemeToDocument` уже есть)
- Добавить поля `appTitle` и `appSubtitle` в интерфейс `Tenant`
- `isServiceEnabled()` — реальная проверка по `enabled_services`
- Попытка загрузки из БД остаётся как дополнительный слой (если в БД есть данные — они перезапишут локальные), но основной fallback — локальный конфиг

### 3. `src/pages/SplashScreen.tsx`

- Импорт `useTenantContext`
- Заменить захардкоженный "ДОБРОСЕРВИС" на `tenant?.appTitle`
- Заменить подзаголовок на `tenant?.appSubtitle`
- Иконка Bot остаётся

### 4. `src/pages/Services.tsx`

- Получить `enabledServices` (или `isServiceEnabled`) из `useTenantContext`
- Фильтровать массив `services` из mockData: показывать только те, чей `id` есть в `tenant.enabled_services`
- Сохранять порядок из `enabledServices`
- Скрывать пустые категории (если после фильтрации в категории 0 сервисов — не рендерить секцию)

### 5. `src/components/chat/NewConsultationSheet.tsx`

- Получить `tenant` из `useTenantContext`
- Фильтровать ассистентов: показывать только тех, чей `id` есть в `tenant.enabled_services`
- `assistant` (Добро-ассистент / `default`) — всегда первый в списке

## Файлы

| Файл | Действие |
|------|----------|
| `src/config/tenants.ts` | Создать |
| `src/contexts/TenantContext.tsx` | Изменить — добавить appTitle/appSubtitle, интегрировать локальный конфиг |
| `src/pages/SplashScreen.tsx` | Изменить — динамический title/subtitle из контекста |
| `src/pages/Services.tsx` | Изменить — фильтрация сервисов по enabledServices |
| `src/components/chat/NewConsultationSheet.tsx` | Изменить — фильтрация ассистентов по enabledServices |

## Что НЕ трогаем

- AI-чат логику, Edge Functions
- Авторизацию
- Feed-контент
- BottomNav (уже переделан)
- Админку

## Как тестировать

Добавить `?tenant=gpb` или `?tenant=wb` к URL — приложение должно сменить:
- Цвет (--primary)
- Название на SplashScreen
- Набор доступных сервисов
- Набор ассистентов в Sheet "+"

