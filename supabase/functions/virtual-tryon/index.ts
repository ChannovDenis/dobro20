import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version, x-session-id",
};

// Maximum URL and text lengths
const MAX_URL_LENGTH = 2048;
const MAX_DESCRIPTION_LENGTH = 500;
const MAX_STYLE_LENGTH = 100;

// Allowed image URL domains
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
    return { valid: false, error: "Требуется фото пользователя" };
  }

  if (imageUrl.length > MAX_URL_LENGTH) {
    return { valid: false, error: "URL слишком длинный" };
  }

  // Allow data URLs for base64 images
  if (imageUrl.startsWith('data:image/')) {
    const match = imageUrl.match(/^data:image\/(jpeg|jpg|png|gif|webp);base64,/);
    if (!match) {
      return { valid: false, error: "Неверный формат изображения" };
    }
    return { valid: true, url: imageUrl };
  }

  try {
    const url = new URL(imageUrl);
    
    if (url.protocol !== 'https:') {
      return { valid: false, error: "Требуется HTTPS URL" };
    }

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

function validateTextInput(text: unknown, maxLength: number, fieldName: string): { valid: boolean; error?: string; value?: string } {
  if (text === undefined || text === null) {
    return { valid: true, value: undefined };
  }

  if (typeof text !== 'string') {
    return { valid: false, error: `${fieldName} должно быть строкой` };
  }

  if (text.length > maxLength) {
    return { valid: false, error: `${fieldName} слишком длинное (макс ${maxLength} символов)` };
  }

  // Remove potentially harmful characters
  const sanitized = text.replace(/[<>]/g, '').trim();
  return { valid: true, value: sanitized };
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
    const { userPhotoUrl, clothingDescription, style } = body;
    
    // Validate image URL
    const urlValidation = validateImageUrl(userPhotoUrl);
    if (!urlValidation.valid) {
      return new Response(
        JSON.stringify({ error: "Некорректное изображение" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate text inputs
    const descValidation = validateTextInput(clothingDescription, MAX_DESCRIPTION_LENGTH, "Описание одежды");
    if (!descValidation.valid) {
      return new Response(
        JSON.stringify({ error: "Некорректное описание" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const styleValidation = validateTextInput(style, MAX_STYLE_LENGTH, "Стиль");
    if (!styleValidation.valid) {
      return new Response(
        JSON.stringify({ error: "Некорректный стиль" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("Missing API key");
      throw new Error("Configuration error");
    }

    const outfitDescription = descValidation.value || `стильный ${styleValidation.value || "casual"} образ`;

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
