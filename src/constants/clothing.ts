import { ClothingItem } from "@/types/chat";

export const CLOTHING_CATALOG: ClothingItem[] = [
  // Tops
  {
    id: "white-tshirt",
    name: "Базовая белая футболка",
    category: "tops",
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
    colors: ["#FFFFFF"],
    price: 2990,
  },
  {
    id: "black-blazer",
    name: "Чёрный оверсайз блейзер",
    category: "tops",
    imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400",
    colors: ["#1A1A1A"],
    price: 12990,
  },
  {
    id: "beige-sweater",
    name: "Бежевый кашемировый свитер",
    category: "tops",
    imageUrl: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400",
    colors: ["#D4B896"],
    price: 8990,
  },
  {
    id: "silk-blouse",
    name: "Шёлковая блуза",
    category: "tops",
    imageUrl: "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=400",
    colors: ["#E8D5C4", "#000000"],
    price: 7490,
  },

  // Bottoms
  {
    id: "blue-jeans",
    name: "Классические синие джинсы",
    category: "bottoms",
    imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400",
    colors: ["#4A6FA5"],
    price: 6990,
  },
  {
    id: "black-trousers",
    name: "Чёрные брюки палаццо",
    category: "bottoms",
    imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400",
    colors: ["#1A1A1A"],
    price: 5990,
  },
  {
    id: "midi-skirt",
    name: "Сатиновая юбка миди",
    category: "bottoms",
    imageUrl: "https://images.unsplash.com/photo-1583496661160-fb5886a0uj?w=400",
    colors: ["#C9B8A8", "#000000"],
    price: 4990,
  },

  // Dresses
  {
    id: "little-black-dress",
    name: "Маленькое чёрное платье",
    category: "dresses",
    imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400",
    colors: ["#1A1A1A"],
    price: 9990,
  },
  {
    id: "floral-maxi",
    name: "Цветочное макси платье",
    category: "dresses",
    imageUrl: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400",
    colors: ["#E8D5C4", "#6B8E6B"],
    price: 11990,
  },

  // Outerwear
  {
    id: "trench-coat",
    name: "Бежевый тренч",
    category: "outerwear",
    imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400",
    colors: ["#C9B8A8"],
    price: 18990,
  },
  {
    id: "leather-jacket",
    name: "Кожаная куртка",
    category: "outerwear",
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
    colors: ["#1A1A1A", "#8B4513"],
    price: 24990,
  },

  // Accessories
  {
    id: "gold-earrings",
    name: "Золотые серьги-кольца",
    category: "accessories",
    imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400",
    colors: ["#FFD700"],
    price: 3990,
  },
  {
    id: "leather-bag",
    name: "Кожаная сумка тоут",
    category: "accessories",
    imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400",
    colors: ["#8B4513", "#1A1A1A"],
    price: 14990,
  },
];

export const CATEGORY_LABELS: Record<string, string> = {
  tops: "Верх",
  bottoms: "Низ",
  dresses: "Платья",
  outerwear: "Верхняя одежда",
  accessories: "Аксессуары",
};

export function getClothingByCategory(category: string): ClothingItem[] {
  return CLOTHING_CATALOG.filter((item) => item.category === category);
}

export function getRandomOutfit(): ClothingItem[] {
  const top = CLOTHING_CATALOG.filter((i) => i.category === "tops")[
    Math.floor(Math.random() * 4)
  ];
  const bottom = CLOTHING_CATALOG.filter((i) => i.category === "bottoms")[
    Math.floor(Math.random() * 3)
  ];
  return [top, bottom].filter(Boolean);
}
