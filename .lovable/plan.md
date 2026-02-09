

# План: Исправление потери сообщений в чате без топика

## Обнаруженные проблемы

При тестировании были выявлены следующие проблемы:

1. **Сообщения не сохраняются без топика** — когда пользователь открывает `/chat` и пишет сообщение без выбора сервиса, сообщения показываются, но не сохраняются в БД
2. **Потеря истории при перезагрузке** — без `topicId` сообщения хранятся только локально и теряются
3. **Ошибки 406 в консоли** — view `public_tenant_info` возвращает ошибку когда tenant не найден

## Решение

### Автоматическое создание топика при первом сообщении

Когда пользователь отправляет сообщение без активного топика:
1. Автоматически создать "общий" топик с title из первого сообщения
2. Сохранить сообщение в этот топик
3. Обновить URL с новым `topicId`

```text
Пользователь пишет → Нет топика? → Создать топик → Сохранить сообщение → Продолжить
```

## Технические изменения

### Шаг 1: Обновить `useChat.ts`

Добавить функцию `ensureTopicExists`:

```typescript
const ensureTopicExists = useCallback(async (firstMessage: string): Promise<string | null> => {
  if (topicId) return topicId;
  
  // Создать "общий" топик с заголовком из первого сообщения
  const title = firstMessage.slice(0, 50) + (firstMessage.length > 50 ? '...' : '');
  
  const supabase = getSupabaseWithSession();
  const { data: { user } } = await supabase.auth.getUser();
  const sessionId = getSessionId();
  
  const { data, error } = await supabase
    .from('topics')
    .insert({
      title,
      service_type: 'general',
      session_id: user ? null : sessionId,
      user_id: user?.id ?? null,
    })
    .select('id')
    .single();
  
  if (error) {
    console.error('Failed to create topic:', error);
    return null;
  }
  
  setTopicId(data.id);
  return data.id;
}, [topicId]);
```

Обновить `sendMessage` для вызова `ensureTopicExists` перед отправкой.

### Шаг 2: Синхронизация с `Chat.tsx`

После автоматического создания топика:
1. Обновить URL через `setSearchParams({ topicId: newTopicId })`
2. Обновить `currentTopic` в `useTopics`
3. Показать `TopicContextBar` с новой темой

### Шаг 3: Добавить callback в ChatInput

Передать callback `onTopicAutoCreated` для уведомления Chat.tsx о создании топика.

### Шаг 4: Опционально — исправить ошибки 406

Изменить запрос к `public_tenant_info` чтобы использовать `.maybeSingle()` вместо `.single()` — это предотвратит ошибку при отсутствии результата.

## Файлы для изменения

| Файл | Изменения |
|------|-----------|
| `src/hooks/useChat.ts` | Добавить `ensureTopicExists`, вызывать в `sendMessage` |
| `src/pages/Chat.tsx` | Обработать автоматическое создание топика, обновить URL |
| `src/hooks/useTenant.ts` | Использовать `.maybeSingle()` для запроса tenant |

## Ожидаемый результат

1. Любое сообщение в чате автоматически привязывается к топику
2. История сохраняется в БД и доступна после перезагрузки
3. URL обновляется с `topicId` для возможности поделиться/вернуться
4. Консоль чистая от ошибок 406

