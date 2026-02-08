import { useState, useCallback } from "react";
import { Message, ChatAction, ColorPaletteData, TrendItem } from "@/types/chat";
import { detectStyleMode, getContextualActions } from "@/constants/chatActions";
import { getNextTrends } from "@/constants/trends";

const LISA_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/lisa-stylist`;
const COLORTYPE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/colortype-analyzer`;
const TRYON_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/virtual-tryon`;

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStyleMode, setIsStyleMode] = useState(false);
  const [uploadedPhoto, setUploadedPhoto] = useState<{ file: File; url: string } | null>(null);
  const [lastAction, setLastAction] = useState<string | undefined>();

  const addMessage = useCallback((message: Omit<Message, "id">) => {
    const newMessage: Message = {
      ...message,
      id: crypto.randomUUID(),
    };
    setMessages((prev) => [...prev, newMessage]);
    return newMessage.id;
  }, []);

  const updateMessage = useCallback((id: string, updates: Partial<Message>) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
  }, []);

  const streamResponse = async (
    content: string,
    conversationHistory: { role: string; content: string }[]
  ) => {
    const response = await fetch(LISA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({
        messages: conversationHistory,
        isStyleMode,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("Превышен лимит запросов. Попробуйте позже.");
      }
      if (response.status === 402) {
        throw new Error("Требуется пополнение баланса.");
      }
      throw new Error("Ошибка сервера");
    }

    if (!response.body) {
      throw new Error("Нет ответа от сервера");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let assistantContent = "";
    let messageId: string | null = null;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") break;

        try {
          const parsed = JSON.parse(jsonStr);
          const chunk = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (chunk) {
            assistantContent += chunk;
            if (!messageId) {
              messageId = addMessage({ role: "assistant", content: assistantContent });
            } else {
              updateMessage(messageId, { content: assistantContent });
            }
          }
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }

    return { messageId, content: assistantContent };
  };

  const sendMessage = useCallback(
    async (content: string) => {
      // Detect style mode from keywords
      if (detectStyleMode(content)) {
        setIsStyleMode(true);
      }

      // Add user message
      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content,
        imageUrl: uploadedPhoto?.url,
      };
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      // Build conversation history
      const history = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      try {
        const { messageId, content: assistantContent } = await streamResponse(
          content,
          history
        );

        // Add contextual action buttons
        if (messageId) {
          const buttons = getContextualActions({
            hasPhoto: !!uploadedPhoto,
            lastAction,
            isStyleMode,
          });
          if (buttons.length > 0) {
            updateMessage(messageId, { buttons });
          }
        }

        // Clear uploaded photo after sending
        if (uploadedPhoto) {
          setUploadedPhoto(null);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Произошла ошибка";
        addMessage({
          role: "assistant",
          content: `⚠️ ${errorMessage}. Попробуйте ещё раз.`,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isStyleMode, uploadedPhoto, lastAction, addMessage, updateMessage]
  );

  const handleAction = useCallback(
    async (action: ChatAction) => {
      setLastAction(action);
      setIsLoading(true);

      try {
        switch (action) {
          case "tryon":
            if (!uploadedPhoto) {
              addMessage({
                role: "assistant",
                content: "👗 Для виртуальной примерки мне нужно твоё фото! Загрузи селфи или фото в полный рост, и я покажу, как на тебе будут смотреться разные образы ✨",
              });
            } else {
              const tryonResponse = await fetch(TRYON_URL, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
                },
                body: JSON.stringify({
                  userPhotoUrl: uploadedPhoto.url,
                  style: "casual chic",
                }),
              });

              if (!tryonResponse.ok) throw new Error("Ошибка примерки");
              const result = await tryonResponse.json();

              addMessage({
                role: "assistant",
                content: `✨ Вот как ты выглядишь в образе "${result.description}"! Нравится? Могу показать другие стили 👗`,
                resultImageUrl: result.imageUrl,
                beforeImageUrl: uploadedPhoto.url,
                buttons: getContextualActions({ hasPhoto: true, lastAction: "tryon", isStyleMode: true }),
              });
            }
            break;

          case "colortype":
            if (!uploadedPhoto) {
              addMessage({
                role: "assistant",
                content: "🎨 Для анализа цветотипа нужно твоё фото при дневном освещении. Загрузи фото лица, и я определю твой цветотип и подберу идеальную палитру!",
              });
            } else {
              const colortypeResponse = await fetch(COLORTYPE_URL, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
                },
                body: JSON.stringify({ imageUrl: uploadedPhoto.url }),
              });

              if (!colortypeResponse.ok) throw new Error("Ошибка анализа");
              const colorData: ColorPaletteData = await colortypeResponse.json();

              addMessage({
                role: "assistant",
                content: `🎨 Твой цветотип — **${colorData.type} (${colorData.season})**! ${colorData.description}`,
                colorPalette: colorData,
                buttons: getContextualActions({ hasPhoto: true, lastAction: "colortype", isStyleMode: true }),
              });
            }
            break;

          case "trends_2026":
          case "more_trends":
            const trends = getNextTrends(3);
            addMessage({
              role: "assistant",
              content: "✨ Вот главные тренды 2026 года! Листай карточки и выбирай, что тебе ближе 👇",
              trendGallery: trends,
              buttons: [
                { id: "more", icon: "➕", label: "Ещё тренды", action: "more_trends", variant: "secondary" },
              ],
            });
            break;

          case "style":
            setIsStyleMode(true);
            addMessage({
              role: "assistant",
              content: "👔 Отлично! Расскажи, какой стиль тебе ближе — casual, классика, спорт-шик? Или загрузи фото образа, который тебе нравится, и я подберу что-то похожее!",
              buttons: getContextualActions({ hasPhoto: !!uploadedPhoto, lastAction: "style", isStyleMode: true }),
            });
            break;

          case "upload_photo":
          case "new_photo":
            // This is handled by the ImageUploader component
            break;

          case "try_another":
            addMessage({
              role: "assistant",
              content: "🔄 Какой стиль попробуем? Casual, романтика, офисный look, или что-то дерзкое?",
            });
            break;

          case "where_to_buy":
            addMessage({
              role: "assistant",
              content: "🛒 Скоро здесь появятся ссылки на магазины-партнёры! А пока могу подсказать, на что обратить внимание при выборе 💫",
            });
            break;
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Произошла ошибка";
        addMessage({
          role: "assistant",
          content: `⚠️ ${errorMessage}. Попробуйте ещё раз.`,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [uploadedPhoto, addMessage]
  );

  const handleImageUpload = useCallback((file: File, url: string) => {
    setUploadedPhoto({ file, url });
    setIsStyleMode(true);
  }, []);

  const clearUploadedPhoto = useCallback(() => {
    if (uploadedPhoto?.url) {
      URL.revokeObjectURL(uploadedPhoto.url);
    }
    setUploadedPhoto(null);
  }, [uploadedPhoto]);

  return {
    messages,
    isLoading,
    isStyleMode,
    uploadedPhoto,
    sendMessage,
    handleAction,
    handleImageUpload,
    clearUploadedPhoto,
  };
}
