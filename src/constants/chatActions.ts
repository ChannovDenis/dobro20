import { ActionButton } from "@/types/chat";

export const STYLE_TRIGGER_KEYWORDS = [
  "стиль",
  "одежда",
  "образ",
  "примерить",
  "цветотип",
  "мода",
  "тренд",
  "гардероб",
  "outfit",
  "style",
  "fashion",
  "look",
  "наряд",
  "примерка",
];

export const WELCOME_ACTIONS: ActionButton[] = [
  {
    id: "tryon",
    icon: "👗",
    label: "Примерить образ",
    action: "tryon",
    variant: "primary",
  },
  {
    id: "colortype",
    icon: "🎨",
    label: "Мой цветотип",
    action: "colortype",
    variant: "secondary",
  },
  {
    id: "trends",
    icon: "✨",
    label: "Тренды 2026",
    action: "trends_2026",
    variant: "secondary",
  },
];

export const PHOTO_UPLOADED_ACTIONS: ActionButton[] = [
  {
    id: "analyze_colortype",
    icon: "🎨",
    label: "Анализ цветотипа",
    action: "colortype",
    variant: "primary",
  },
  {
    id: "try_style",
    icon: "👗",
    label: "Примерить стиль",
    action: "tryon",
    variant: "secondary",
  },
];

export const AFTER_TRYON_ACTIONS: ActionButton[] = [
  {
    id: "try_another",
    icon: "🔄",
    label: "Другой стиль",
    action: "try_another",
    variant: "secondary",
  },
  {
    id: "where_to_buy",
    icon: "🛒",
    label: "Где купить",
    action: "where_to_buy",
    variant: "primary",
  },
];

export const AFTER_COLORTYPE_ACTIONS: ActionButton[] = [
  {
    id: "style_recommendations",
    icon: "👔",
    label: "Подобрать гардероб",
    action: "style",
    variant: "primary",
  },
  {
    id: "trends",
    icon: "✨",
    label: "Тренды для меня",
    action: "trends_2026",
    variant: "secondary",
  },
];

export function detectStyleMode(text: string): boolean {
  const lowerText = text.toLowerCase();
  return STYLE_TRIGGER_KEYWORDS.some((keyword) =>
    lowerText.includes(keyword.toLowerCase())
  );
}

export function getContextualActions(context: {
  hasPhoto: boolean;
  lastAction?: string;
  isStyleMode: boolean;
}): ActionButton[] {
  if (context.lastAction === "tryon") {
    return AFTER_TRYON_ACTIONS;
  }
  if (context.lastAction === "colortype") {
    return AFTER_COLORTYPE_ACTIONS;
  }
  if (context.hasPhoto) {
    return PHOTO_UPLOADED_ACTIONS;
  }
  if (context.isStyleMode) {
    return WELCOME_ACTIONS;
  }
  return [];
}
