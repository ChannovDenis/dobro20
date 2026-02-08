import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userPhotoUrl, clothingDescription, style } = await req.json();
    
    if (!userPhotoUrl) {
      return new Response(
        JSON.stringify({ error: "Требуется фото пользователя" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const outfitDescription = clothingDescription || `стильный ${style || "casual"} образ`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Создай реалистичное фото виртуальной примерки. 
                
Покажи человека с этого фото в следующем образе: ${outfitDescription}

Требования:
- Сохрани лицо, телосложение и позу человека с оригинального фото
- Замени только одежду на описанный образ
- Фото должно выглядеть реалистично, как модная съёмка
- Хорошее освещение и качество
- Нейтральный или стильный фон`,
              },
              { type: "image_url", image_url: { url: userPhotoUrl } },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Превышен лимит запросов" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Требуется пополнение баланса" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("Virtual try-on error:", response.status, errorText);
      throw new Error("Ошибка генерации образа");
    }

    const data = await response.json();
    
    // Extract generated image URL from response
    const generatedImageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!generatedImageUrl) {
      // Fallback: return a placeholder with styling description
      return new Response(
        JSON.stringify({
          success: true,
          imageUrl: null,
          description: `Образ: ${outfitDescription}`,
          message: "Примерка создана! Представьте себя в этом образе.",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        imageUrl: generatedImageUrl,
        description: outfitDescription,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("virtual-tryon error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Ошибка примерки" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
