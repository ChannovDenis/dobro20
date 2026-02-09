
# План: Сохранение сообщений в базу данных

## Проблема

Сейчас сообщения хранятся только в `localStorage` через хук `useChat`. При перезагрузке страницы или смене устройства история теряется. Хук `useTopics` уже имеет функции для работы с БД (`addMessage`, `fetchMessages`), но они не используются.

## Текущая архитектура

```text
┌─────────────────┐         ┌─────────────────┐
│    useChat      │         │   useTopics     │
│ (localStorage)  │  ←─X─→  │ (Supabase)      │
│                 │         │                 │
│ messages[]      │         │ addMessage()    │
│ sendMessage()   │         │ fetchMessages() │
└─────────────────┘         └─────────────────┘
```

## Решение

Интегрировать `useChat` с `useTopics` для автоматического сохранения каждого сообщения в `topic_messages`.

### Новая архитектура

```text
┌─────────────────────────────────────────────────┐
│                   useChat                        │
├─────────────────────────────────────────────────┤
│  sendMessage(content)                            │
│      ├→ Сохранить user message в БД             │
│      ├→ Получить AI ответ (streaming)           │
│      └→ Сохранить assistant message в БД        │
├─────────────────────────────────────────────────┤
│  При смене topicId:                              │
│      └→ Загрузить историю из БД                 │
└─────────────────────────────────────────────────┘
```

---

## Технические изменения

### Шаг 1: Обновить `useChat.ts`

1. **Добавить сохранение в БД** при отправке сообщения:
   - Перед отправкой: сохранить user message в `topic_messages`
   - После получения ответа: сохранить assistant message в `topic_messages`

2. **Загружать историю при смене топика**:
   - При изменении `topicId` — загрузить сообщения из БД
   - Преобразовать формат `TopicMessage` → `Message`

3. **Убрать localStorage** для сообщений (оставить только БД)

### Шаг 2: Обновить типы

Добавить в `Message` поле `dbId` для связи с записью в БД.

### Шаг 3: Обработка метаданных

Сохранять в `metadata` дополнительные данные:
- `imageUrl` — URL загруженного фото
- `buttons` — кнопки действий
- `colorPalette` — данные цветотипа
- `escalation` — данные эскалации

---

## Изменения в коде

### `src/hooks/useChat.ts`

```typescript
// Добавить импорт
import { getSupabaseWithSession } from '@/lib/supabaseWithSession';

// В sendMessage:
const sendMessage = async (content: string) => {
  if (!topicId) {
    console.warn('No topic selected');
    return;
  }

  // 1. Добавить user message локально
  const userMessage = { role: 'user', content, imageUrl };
  setMessages(prev => [...prev, userMessage]);

  // 2. Сохранить в БД
  await supabase.from('topic_messages').insert({
    topic_id: topicId,
    role: 'user',
    content,
    metadata: imageUrl ? { imageUrl } : null,
  });

  // 3. Получить ответ AI (streaming)
  const { content: aiContent } = await streamResponse(...);

  // 4. Сохранить ответ в БД
  await supabase.from('topic_messages').insert({
    topic_id: topicId,
    role: 'assistant',
    content: aiContent,
    metadata: { buttons, escalation },
  });
};

// При смене topicId — загрузить историю:
useEffect(() => {
  if (topicId) {
    loadMessagesFromDB(topicId);
  }
}, [topicId]);

const loadMessagesFromDB = async (topicId: string) => {
  const { data } = await supabase
    .from('topic_messages')
    .select('*')
    .eq('topic_id', topicId)
    .order('created_at', { ascending: true });
  
  // Преобразовать TopicMessage → Message
  const messages = data.map(m => ({
    id: m.id,
    role: m.role,
    content: m.content,
    ...m.metadata,
  }));
  
  setMessages(messages);
};
```

---

## Формат метаданных в БД

```json
{
  "imageUrl": "blob:...",
  "buttons": [{ "id": "...", "label": "...", "action": "..." }],
  "colorPalette": { "type": "...", "colors": [...] },
  "escalation": { "serviceId": "lawyer" }
}
```

---

## Обратная совместимость

- При первом открытии чата без топика — создать топик автоматически
- Миграция из localStorage не требуется (данные там были временными)

---

## Файлы для изменения

| Файл | Изменения |
|------|-----------|
| `src/hooks/useChat.ts` | Интеграция с БД, загрузка истории |
| `src/types/chat.ts` | Добавить `dbId?: string` в Message |
| `src/pages/Chat.tsx` | Убедиться что topicId передаётся корректно |

---

## Ожидаемый результат

1. Каждое сообщение сохраняется в `topic_messages`
2. При возврате к топику — история загружается из БД
3. Работает для анонимных пользователей (через session_id)
4. Метаданные (кнопки, палитра, эскалация) сохраняются в JSON
