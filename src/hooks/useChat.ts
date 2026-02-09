import { useState, useCallback, useEffect } from "react";
import { Message, ChatAction, ColorPaletteData, EscalationData } from "@/types/chat";
import { detectStyleMode, getContextualActions } from "@/constants/chatActions";
import { getNextTrends } from "@/constants/trends";
import { getSessionId } from "@/lib/session";
import { getSupabaseWithSession } from "@/lib/supabaseWithSession";

const LISA_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/lisa-stylist`;
const COLORTYPE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/colortype-analyzer`;
const TRYON_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/virtual-tryon`;

const ESCALATION_THRESHOLD = 5;

// Helper to get auth headers with session ID
function getAuthHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    "x-session-id": getSessionId(),
  };
}

// Convert DB message to local Message format
interface DBMessage {
  id: string;
  role: "user" | "assistant" | "system" | "expert";
  content: string;
  metadata: Record<string, unknown> | null;
  created_at: string | null;
}

function dbMessageToLocal(dbMsg: DBMessage): Message {
  const metadata = dbMsg.metadata || {};
  return {
    id: crypto.randomUUID(),
    dbId: dbMsg.id,
    role: dbMsg.role === "user" ? "user" : "assistant",
    content: dbMsg.content,
    imageUrl: metadata.imageUrl as string | undefined,
    resultImageUrl: metadata.resultImageUrl as string | undefined,
    beforeImageUrl: metadata.beforeImageUrl as string | undefined,
    buttons: metadata.buttons as Message["buttons"],
    colorPalette: metadata.colorPalette as Message["colorPalette"],
    trendGallery: metadata.trendGallery as Message["trendGallery"],
    clothingOptions: metadata.clothingOptions as Message["clothingOptions"],
    escalation: metadata.escalation as Message["escalation"],
  };
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStyleMode, setIsStyleMode] = useState(false);
  const [uploadedPhoto, setUploadedPhoto] = useState<{ file: File; url: string } | null>(null);
  const [lastAction, setLastAction] = useState<string | undefined>();
  const [serviceType, setServiceType] = useState<string | null>(null);
  const [topicId, setTopicId] = useState<string | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Load messages from DB when topicId changes
  useEffect(() => {
    if (!topicId) {
      setMessages([]);
      return;
    }

    const loadMessagesFromDB = async () => {
      setIsLoadingHistory(true);
      try {
        const supabase = getSupabaseWithSession();
        const { data, error } = await supabase
          .from("topic_messages")
          .select("*")
          .eq("topic_id", topicId)
          .order("created_at", { ascending: true });

        if (error) {
          console.error("Error loading messages:", error);
          return;
        }

        if (data) {
          const loadedMessages = data.map((m) => dbMessageToLocal(m as DBMessage));
          setMessages(loadedMessages);
        }
      } catch (err) {
        console.error("Failed to load messages:", err);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadMessagesFromDB();
  }, [topicId]);

  // Save message to database
  const saveMessageToDB = useCallback(
    async (
      role: "user" | "assistant",
      content: string,
      metadata?: Record<string, unknown>
    ): Promise<string | null> => {
      if (!topicId) {
        console.warn("No topic selected, cannot save message");
        return null;
      }

      try {
        const supabase = getSupabaseWithSession();
        const { data, error } = await supabase
          .from("topic_messages")
          .insert([{
            topic_id: topicId,
            role,
            content,
            metadata: metadata as unknown as null,
          }])
          .select("id")
          .single();

        if (error) {
          console.error("Error saving message:", error);
          return null;
        }

        return data?.id || null;
      } catch (err) {
        console.error("Failed to save message:", err);
        return null;
      }
    },
    [topicId]
  );

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
      headers: getAuthHeaders(),
      body: JSON.stringify({
        messages: conversationHistory,
        isStyleMode,
      }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Требуется авторизация.");
      }
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
      if (!topicId) {
        console.warn("No topic selected");
        return;
      }

      // Detect style mode from keywords
      if (detectStyleMode(content)) {
        setIsStyleMode(true);
      }

      // Add user message locally
      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content,
        imageUrl: uploadedPhoto?.url,
      };
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      // Save user message to DB
      const userMetadata: Record<string, unknown> = {};
      if (uploadedPhoto?.url) {
        userMetadata.imageUrl = uploadedPhoto.url;
      }
      await saveMessageToDB("user", content, Object.keys(userMetadata).length > 0 ? userMetadata : undefined);

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

        // Add contextual action buttons and escalation
        const buttons = getContextualActions({
          hasPhoto: !!uploadedPhoto,
          lastAction,
          isStyleMode,
        });

        // Check if we should show escalation (after threshold messages)
        const totalMessages = messages.length + 2;
        let escalation: EscalationData | undefined;

        if (serviceType && totalMessages >= ESCALATION_THRESHOLD) {
          escalation = {
            serviceId: serviceType,
          };
        }

        const updates: Partial<Message> = {};
        if (buttons.length > 0) updates.buttons = buttons;
        if (escalation) updates.escalation = escalation;

        if (messageId && Object.keys(updates).length > 0) {
          updateMessage(messageId, updates);
        }

        // Save assistant message to DB with metadata
        const assistantMetadata: Record<string, unknown> = {};
        if (buttons.length > 0) assistantMetadata.buttons = buttons;
        if (escalation) assistantMetadata.escalation = escalation;
        
        await saveMessageToDB(
          "assistant",
          assistantContent,
          Object.keys(assistantMetadata).length > 0 ? assistantMetadata : undefined
        );

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
    [messages, isStyleMode, uploadedPhoto, lastAction, serviceType, topicId, addMessage, updateMessage, saveMessageToDB]
  );

  const handleAction = useCallback(
    async (action: ChatAction) => {
      setLastAction(action);
      setIsLoading(true);

      try {
        switch (action) {
          case "tryon":
            if (!uploadedPhoto) {
              const content = "👗 Для виртуальной примерки мне нужно твоё фото! Загрузи селфи или фото в полный рост, и я покажу, как на тебе будут смотреться разные образы ✨";
              addMessage({ role: "assistant", content });
              await saveMessageToDB("assistant", content);
            } else {
              const tryonResponse = await fetch(TRYON_URL, {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify({
                  userPhotoUrl: uploadedPhoto.url,
                  style: "casual chic",
                }),
              });

              if (!tryonResponse.ok) {
                if (tryonResponse.status === 401) throw new Error("Требуется авторизация");
                throw new Error("Ошибка примерки");
              }
              const result = await tryonResponse.json();
              const buttons = getContextualActions({ hasPhoto: true, lastAction: "tryon", isStyleMode: true });

              const content = `✨ Вот как ты выглядишь в образе "${result.description}"! Нравится? Могу показать другие стили 👗`;
              addMessage({
                role: "assistant",
                content,
                resultImageUrl: result.imageUrl,
                beforeImageUrl: uploadedPhoto.url,
                buttons,
              });
              await saveMessageToDB("assistant", content, {
                resultImageUrl: result.imageUrl,
                beforeImageUrl: uploadedPhoto.url,
                buttons,
              });
            }
            break;

          case "colortype":
            if (!uploadedPhoto) {
              const content = "🎨 Для анализа цветотипа нужно твоё фото при дневном освещении. Загрузи фото лица, и я определю твой цветотип и подберу идеальную палитру!";
              addMessage({ role: "assistant", content });
              await saveMessageToDB("assistant", content);
            } else {
              const colortypeResponse = await fetch(COLORTYPE_URL, {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify({ imageUrl: uploadedPhoto.url }),
              });

              if (!colortypeResponse.ok) {
                if (colortypeResponse.status === 401) throw new Error("Требуется авторизация");
                throw new Error("Ошибка анализа");
              }
              const colorData: ColorPaletteData = await colortypeResponse.json();
              const buttons = getContextualActions({ hasPhoto: true, lastAction: "colortype", isStyleMode: true });

              const content = `🎨 Твой цветотип — **${colorData.type} (${colorData.season})**! ${colorData.description}`;
              addMessage({
                role: "assistant",
                content,
                colorPalette: colorData,
                buttons,
              });
              await saveMessageToDB("assistant", content, { colorPalette: colorData, buttons });
            }
            break;

          case "trends_2026":
          case "more_trends":
            const trends = getNextTrends(3);
            const trendButtons = [
              { id: "more", icon: "➕", label: "Ещё тренды", action: "more_trends" as const, variant: "secondary" as const },
            ];
            const trendContent = "✨ Вот главные тренды 2026 года! Листай карточки и выбирай, что тебе ближе 👇";
            addMessage({
              role: "assistant",
              content: trendContent,
              trendGallery: trends,
              buttons: trendButtons,
            });
            await saveMessageToDB("assistant", trendContent, { trendGallery: trends, buttons: trendButtons });
            break;

          case "style":
            setIsStyleMode(true);
            const styleButtons = getContextualActions({ hasPhoto: !!uploadedPhoto, lastAction: "style", isStyleMode: true });
            const styleContent = "👔 Отлично! Расскажи, какой стиль тебе ближе — casual, классика, спорт-шик? Или загрузи фото образа, который тебе нравится, и я подберу что-то похожее!";
            addMessage({
              role: "assistant",
              content: styleContent,
              buttons: styleButtons,
            });
            await saveMessageToDB("assistant", styleContent, { buttons: styleButtons });
            break;

          case "upload_photo":
          case "new_photo":
            // This is handled by the ImageUploader component
            break;

          case "try_another":
            const tryAnotherContent = "🔄 Какой стиль попробуем? Casual, романтика, офисный look, или что-то дерзкое?";
            addMessage({ role: "assistant", content: tryAnotherContent });
            await saveMessageToDB("assistant", tryAnotherContent);
            break;

          case "where_to_buy":
            const buyContent = "🛒 Скоро здесь появятся ссылки на магазины-партнёры! А пока могу подсказать, на что обратить внимание при выборе 💫";
            addMessage({ role: "assistant", content: buyContent });
            await saveMessageToDB("assistant", buyContent);
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
    [uploadedPhoto, addMessage, saveMessageToDB]
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

  const clearHistory = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    isLoadingHistory,
    isStyleMode,
    uploadedPhoto,
    sendMessage,
    handleAction,
    handleImageUpload,
    clearUploadedPhoto,
    clearHistory,
    setServiceType,
    setTopicId,
    serviceType,
    topicId,
  };
}
