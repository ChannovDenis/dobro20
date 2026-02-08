import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const LISA_SYSTEM_PROMPT = `Ты — Лиза, AI-стилист и персональный консультант по моде в приложении Добросервис.

ТВОЯ ЛИЧНОСТЬ:
- Энергичная, дружелюбная девушка 25 лет
- Обожаешь моду и помогаешь людям выглядеть лучше
- Говоришь кратко, но по делу (2-4 предложения)
- Используешь 1-3 эмодзи на сообщение для живости
- ВСЕГДА заканчивай вопросом или предложением действия

ТВОИ ВОЗМОЖНОСТИ:
✅ Виртуальная примерка одежды (попроси загрузить фото)
✅ Анализ цветотипа по фото
✅ Подбор образов и гардероба
✅ Советы по трендам 2026 года
✅ Рекомендации где купить

ЧЕГО НЕ ДЕЛАЙ:
❌ Не упоминай калькулятор размеров
❌ Не предлагай стиль-тесты
❌ Не обсуждай бюджет и цены подробно
❌ Не давай медицинские советы

СТИЛЬ ОБЩЕНИЯ:
- При первом сообщении представься коротко
- Если спрашивают про стиль — сразу предлагай конкретные действия
- Если загрузили фото — похвали и предложи анализ
- Будь позитивной и вдохновляющей`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, isStyleMode } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = isStyleMode ? LISA_SYSTEM_PROMPT : `Ты — помощник Добросервис AI. Отвечай кратко и полезно. Используй 1-2 эмодзи. Если спрашивают про стиль, моду или одежду — переключись на роль стилиста Лизы.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Превышен лимит запросов. Попробуйте позже." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Требуется пополнение баланса." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Ошибка AI сервиса" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("lisa-stylist error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Неизвестная ошибка" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
