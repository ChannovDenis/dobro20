import { TrendItem } from "@/types/chat";

export const TRENDS_2026: TrendItem[] = [
  {
    id: "neon-accents",
    title: "Неоновые акценты",
    description: "Яркие неоновые детали на нейтральной базе — главный тренд сезона",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600",
    tags: ["Яркий", "Смелый", "Вечерний"],
  },
  {
    id: "oversized-blazers",
    title: "Оверсайз блейзеры",
    description: "Объёмные пиджаки в мужском стиле — must-have 2026",
    imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600",
    tags: ["Классика", "Офис", "Casual"],
  },
  {
    id: "eco-materials",
    title: "Эко-материалы",
    description: "Органический хлопок, переработанные ткани, осознанное потребление",
    imageUrl: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600",
    tags: ["Эко", "Sustainable", "Базовый"],
  },
  {
    id: "y2k-revival",
    title: "Y2K возвращение",
    description: "Низкая посадка, блестящие ткани, ностальгия по 2000-м",
    imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600",
    tags: ["Ретро", "Вечеринка", "Молодёжный"],
  },
  {
    id: "quiet-luxury",
    title: "Тихая роскошь",
    description: "Минимализм, качественные ткани, отсутствие логотипов",
    imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600",
    tags: ["Минимализм", "Премиум", "Элегантный"],
  },
  {
    id: "dopamine-dressing",
    title: "Допамин дрессинг",
    description: "Одежда, которая поднимает настроение — яркие цвета и принты",
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600",
    tags: ["Яркий", "Позитивный", "Лето"],
  },
  {
    id: "sheer-layers",
    title: "Прозрачные слои",
    description: "Многослойность с прозрачными тканями — сексуально и элегантно",
    imageUrl: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600",
    tags: ["Вечерний", "Смелый", "Романтика"],
  },
  {
    id: "utility-chic",
    title: "Утилитарный шик",
    description: "Карманы, ремни, функциональность — красота в практичности",
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600",
    tags: ["Casual", "Практичный", "Street"],
  },
];

let shownTrendIds: string[] = [];

export function getNextTrends(count: number = 3): TrendItem[] {
  const unshown = TRENDS_2026.filter((t) => !shownTrendIds.includes(t.id));

  if (unshown.length < count) {
    shownTrendIds = [];
    return TRENDS_2026.slice(0, count);
  }

  const selected = unshown.slice(0, count);
  shownTrendIds.push(...selected.map((t) => t.id));
  return selected;
}

export function resetShownTrends(): void {
  shownTrendIds = [];
}

export function getTrendById(id: string): TrendItem | undefined {
  return TRENDS_2026.find((t) => t.id === id);
}
