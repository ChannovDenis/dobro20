import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version, x-session-id",
};

// Maximum URL length to prevent resource exhaustion
const MAX_URL_LENGTH = 2048;

// Allowed image URL domains (data URLs are also allowed for base64 images)
const ALLOWED_DOMAINS = [
  'supabase.co',
  'supabase.in',
  'tjximrjleinvvczdzotr.supabase.co',
  'storage.googleapis.com',
  'firebasestorage.googleapis.com',
  'cloudinary.com',
  'res.cloudinary.com',
  'imgur.com',
  'i.imgur.com',
];

function validateImageUrl(imageUrl: unknown): { valid: boolean; error?: string; url?: string } {
  if (!imageUrl || typeof imageUrl !== 'string') {
    return { valid: false, error: "Требуется URL изображения" };
  }

  if (imageUrl.length > MAX_URL_LENGTH) {
    return { valid: false, error: "URL слишком длинный" };
  }

  // Allow data URLs for base64 images
  if (imageUrl.startsWith('data:image/')) {
    // Validate it's a proper data URL
    const match = imageUrl.match(/^data:image\/(jpeg|jpg|png|gif|webp);base64,/);
    if (!match) {
      return { valid: false, error: "Неверный формат изображения" };
    }
    return { valid: true, url: imageUrl };
  }

  // Validate URL format
  try {
    const url = new URL(imageUrl);
    
    // Only allow https
    if (url.protocol !== 'https:') {
      return { valid: false, error: "Требуется HTTPS URL" };
    }

    // Check against allowed domains
    const isAllowed = ALLOWED_DOMAINS.some(domain => 
      url.hostname === domain || url.hostname.endsWith('.' + domain)
    );

    if (!isAllowed) {
      return { valid: false, error: "URL изображения должен быть с разрешённого домена" };
    }

    return { valid: true, url: imageUrl };
  } catch {
    return { valid: false, error: "Неверный формат URL" };
  }
}

async function validateSession(req: Request): Promise<{ valid: boolean; userId?: string; sessionId?: string; error?: string }> {
  const authHeader = req.headers.get('Authorization');
  const sessionId = req.headers.get('x-session-id');
  
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
  
  if (sessionId && sessionId.length >= 32 && sessionId.length <= 128) {
    if (/^[a-zA-Z0-9_-]+$/.test(sessionId)) {
      return { valid: true, sessionId };
    }
  }
  
  return { valid: false, error: "Требуется аутентификация или действительная сессия" };
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
    const { imageUrl } = body;
    
    // Validate image URL
    const urlValidation = validateImageUrl(imageUrl);
    if (!urlValidation.valid) {
      return new Response(
        JSON.stringify({ error: "Некорректное изображение" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("Missing API key");
      throw new Error("Configuration error");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          {
            role: "system",
            content: `Ты — эксперт по колористике и цветотипам. Анализируй фото человека и определяй его цветотип.

ФОРМАТ ОТВЕТА (строго JSON):
{
  "type": "Весна/Лето/Осень/Зима",
  "season": "Тёплая/Холодная/Светлая/Яркая/Мягкая/Глубокая",
  "colors": ["#HEX1", "#HEX2", "#HEX3", "#HEX4", "#HEX5", "#HEX6"],
  "description": "Краткое описание цветотипа (1-2 предложения)",
  "recommendations": ["Рекомендация 1", "Рекомендация 2", "Рекомендация 3"]
}

В colors укажи 6 идеальных цветов для этого цветотипа в формате HEX.
В recommendations дай 3 конкретных совета по одежде.`,
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Определи мой цветотип по этому фото" },
              { type: "image_url", image_url: { url: urlValidation.url } },
            ],
          },
        ],
      }),
    });

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
      console.error("AI service error:", response.status);
      throw new Error("Service error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response");
    }

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid format");
    }

    const colortype = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify(colortype), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Function error:", error);
    return new Response(
      JSON.stringify({ error: "Произошла ошибка. Попробуйте позже." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
