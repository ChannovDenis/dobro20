
# Стабильные тенант-зависимые данные для админ-панели

## Обзор

Все 4 компонента админки (MetricsGrid, ActivityChart, TopServicesTable, RecentEscalations) сейчас используют захардкоженные данные без привязки к тенанту. Задача: создать файл с фиксированными данными для каждого из 6 тенантов и подключить их через `useTenant()`.

## Изменения

### 1. Создать `src/data/tenantMetrics.ts`

Большой файл с тремя экспортами:

- **`dashboardMetrics`** — Record по tenant.id с 4 метриками (aiRequests, escalations, nps, avgTime) и их процентными изменениями
- **`activityChartData`** — Record по tenant.id, массив из 30 дней (17.01-15.02) с полями date/aiRequests/escalations. Реалистичный паттерн: будни выше, выходные ниже, тренд вверх. Масштаб пропорционален тенанту (WB ~5x, GPB ~3x от Добро)
- **`burndownData`** — Record по tenant.id, 30 дней с plan (линейное убывание) и fact (с колебаниями). Разные лимиты для каждого тенанта

### 2. Создать `src/data/tenantEscalations.ts`

Record по tenant.id с массивом эскалаций (user, avatar, service, reason, time, priority, status):
- dobroservice: 3 записи (текущие — наследство, очная консультация, кризис)
- gazprombank: 3 записи (кредитный договор, возврат страховки, реструктуризация)
- wildberries: 2 записи (бракованный товар, блокировка кабинета)
- pochtarf: 2 записи (потеря посылки, задержка EMS)
- mes: 2 записи (перерасчёт отопления, отключение воды)
- alfa: 3 записи (инвестиционный спор, блокировка карты, ипотека)

### 3. Создать `src/data/tenantServices.ts`

Record по tenant.id с массивом сервисов (id, name, requests, limit, icon-id). Для каждого тенанта только его сервисы из enabledServices:
- GPB: Юрист 1840/2000, Финансист 920/1000, Психолог 450/500, Врач 380/500, Безопасность 210/300, Ассистент 620/1000
- WB: Юрист 2100/2500, Стилист 1800/2000, Психолог 650/800, Ассистент 1200/1500
- И так далее для каждого тенанта

### 4. Изменить `src/components/admin/MetricsGrid.tsx`

- Импортировать `dashboardMetrics` и `useTenant`
- Получить `tenantId` из хука
- Маппить 4 карточки из `dashboardMetrics[tenantId]` вместо хардкода METRICS
- Форматирование: aiRequests с toLocaleString(), avgTime с "мин", nps с "%"

### 5. Изменить `src/components/admin/ActivityChart.tsx`

- Импортировать `activityChartData` и `useTenant`
- Использовать `activityChartData[tenantId]` вместо DATA
- Поменять dataKey на "aiRequests" и "escalations"
- Заголовок секции в Admin.tsx: "Активность за месяц" (30 дней вместо недели)

### 6. Изменить `src/components/admin/TopServicesTable.tsx`

- Импортировать `tenantServiceUsage` и `useTenant`
- Показывать сервисы из `tenantServiceUsage[tenantId]`
- Добавить колонку "лимит" (requests/limit формат)
- Прогресс-бар: ширина = requests/limit * 100%

### 7. Изменить `src/components/admin/RecentEscalations.tsx`

- Импортировать `tenantEscalations` и `useTenant`
- Использовать `tenantEscalations[tenantId]` вместо ESCALATIONS
- Добавить badge приоритета (high = красный, medium = оранжевый)

### 8. Изменить `src/pages/Admin.tsx`

- Заголовок графика: "Активность за месяц" вместо "за неделю"

## Файлы

| Файл | Действие |
|------|----------|
| `src/data/tenantMetrics.ts` | Создать — метрики + график активности + burndown |
| `src/data/tenantEscalations.ts` | Создать — эскалации по тенантам |
| `src/data/tenantServices.ts` | Создать — использование сервисов по тенантам |
| `src/components/admin/MetricsGrid.tsx` | Изменить — данные из tenantMetrics |
| `src/components/admin/ActivityChart.tsx` | Изменить — данные из tenantMetrics |
| `src/components/admin/TopServicesTable.tsx` | Изменить — данные из tenantServices |
| `src/components/admin/RecentEscalations.tsx` | Изменить — данные из tenantEscalations |
| `src/pages/Admin.tsx` | Изменить — заголовок "за месяц" |

## Что НЕ трогаем

- Роутинг, авторизацию, UI-компоненты (shadcn), структуру страниц
- Edge Functions, AI-логику
- Темизацию, BottomNav
