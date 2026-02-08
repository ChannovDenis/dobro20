export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
  resultImageUrl?: string;
  beforeImageUrl?: string;
  buttons?: ActionButton[];
  isProcessing?: boolean;
  colorPalette?: ColorPaletteData;
  trendGallery?: TrendItem[];
  clothingOptions?: ClothingItem[];
}

export interface ActionButton {
  id: string;
  icon: string;
  label: string;
  action: ChatAction;
  variant?: "primary" | "secondary";
}

export type ChatAction =
  | "tryon"
  | "colortype"
  | "style"
  | "new_photo"
  | "upload_photo"
  | "products"
  | "trends_2026"
  | "more_trends"
  | "try_another"
  | "where_to_buy";

export interface TrendItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
}

export interface ClothingItem {
  id: string;
  name: string;
  category: ClothingCategory;
  imageUrl: string;
  colors: string[];
  price?: number;
}

export type ClothingCategory =
  | "tops"
  | "bottoms"
  | "dresses"
  | "outerwear"
  | "accessories";

export interface ColorPaletteData {
  type: string;
  season: string;
  colors: string[];
  description: string;
  recommendations: string[];
}

export interface ChatContext {
  hasUploadedPhoto: boolean;
  lastPhotoUrl?: string;
  isStyleMode: boolean;
  currentAction?: ChatAction;
}
