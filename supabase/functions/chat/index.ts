import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version, x-session-id",
};

const SYSTEM_PROMPT = `Ты — Добросервис AI, универсальный помощник в супер-приложении "Добросервис". 

Твои области экспертизы:
- Юридические консультации (права потребителя, трудовое право, семейное право)
- Медицинские вопросы (общие рекомендации, когда обратиться к врачу)
- Психологическая поддержка (управление стрессом, советы по ментальному здоровью)
- Финансовые советы (бюджетирование, инвестиции для начинающих)
- Здоровый образ жизни (питание, тренировки)
- Защита от мошенников (как распознать мошенничество)

Правила ответов:
1. Отвечай на русском языке
2. Будь дружелюбным и поддерживающим
3. Давай конкретные, практичные советы
4. При медицинских вопросах напоминай о необходимости консультации с врачом
5. При юридических вопросах рекомендуй профессиональную консультацию для сложных случаев
6. Используй эмодзи умеренно для дружелюбности
7. Структурируй ответы с помощью списков и заголовков когда уместно
8. Если вопрос вне твоей компетенции, честно об этом скажи`;

// Input validation constants
const MAX_MESSAGES = 50;
const MAX_MESSAGE_LENGTH = 10000;

interface ChatMessage {
  role: string;
  content: string | Array<{ type: string; text?: string; image_url?: { url: string } }>;
}

function validateMessages(messages: unknown): { valid: boolean; error?: string; messages?: ChatMessage[] } {
  if (!messages || !Array.isArray(messages)) {
    return { valid: false, error: "Invalid messages format" };
  }

  if (messages.length > MAX_MESSAGES) {
    return { valid: false, error: `Too many messages (max ${MAX_MESSAGES})` };
  }

  if (messages.length === 0) {
    return { valid: false, error: "At least one message is required" };
  }

  for (const msg of messages) {
    if (!msg || typeof msg !== 'object') {
      return { valid: false, error: "Invalid message object" };
    }
    
    if (!msg.role || !['user', 'assistant', 'system'].includes(msg.role)) {
      return { valid: false, error: "Invalid message role" };
    }

    // Handle string content
    if (typeof msg.content === 'string') {
      if (msg.content.length > MAX_MESSAGE_LENGTH) {
        return { valid: false, error: `Message too long (max ${MAX_MESSAGE_LENGTH} chars)` };
      }
    } 
    // Handle array content (multimodal)
    else if (Array.isArray(msg.content)) {
      for (const part of msg.content) {
        if (part.type === 'text' && part.text) {
          if (typeof part.text !== 'string' || part.text.length > MAX_MESSAGE_LENGTH) {
            return { valid: false, error: `Message text too long (max ${MAX_MESSAGE_LENGTH} chars)` };
          }
        }
      }
    } else {
      return { valid: false, error: "Invalid message content" };
    }
  }

  return { valid: true, messages: messages as ChatMessage[] };
}

async function validateSession(req: Request): Promise<{ valid: boolean; userId?: string; sessionId?: string; error?: string }> {
  const authHeader = req.headers.get('Authorization');
  const sessionId = req.headers.get('x-session-id');
  
  // Check for authenticated user
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data, error } = await supabaseClient.auth.getClaims(token);
    
    if (!error && data?.claims?.sub) {
      return { valid: true, userId: data.claims.sub as string };
    }
  }
  
  // Check for anonymous session
  if (sessionId && sessionId.length >= 32 && sessionId.length <= 128) {
    // Validate session format (alphanumeric with underscores)
    if (/^[a-zA-Z0-9_-]+$/.test(sessionId)) {
      return { valid: true, sessionId };
    }
  }
  
  return { valid: false, error: "Authentication or valid session required" };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate session/authentication
    const sessionResult = await validateSession(req);
    if (!sessionResult.valid) {
      console.error("Auth failed");
      return new Response(
        JSON.stringify({ error: "Требуется авторизация" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { messages } = body;
    
    // Validate input
    const validation = validateMessages(messages);
    if (!validation.valid) {
      console.error("Validation failed");
      return new Response(
        JSON.stringify({ error: "Некорректный запрос" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("[INTERNAL] Missing LOVABLE_API_KEY environment variable");
      return new Response(
        JSON.stringify({ error: "Сервис временно недоступен" }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...(validation.messages ?? []),
        ],
        stream: true,
      }),
    });

    console.log("AI Gateway response status:", response.status);

    if (!response.ok) {
      if (response.status === 429) {
        console.error("Rate limit exceeded");
        return new Response(JSON.stringify({ error: "Сервис временно перегружен. Попробуйте позже." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        console.error("Payment required");
        return new Response(JSON.stringify({ error: "Сервис временно недоступен." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI service error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Произошла ошибка. Попробуйте позже." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Streaming response");
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Function error:", error);
    return new Response(JSON.stringify({ error: "Произошла ошибка. Попробуйте позже." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
