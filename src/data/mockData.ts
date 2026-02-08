import { Scale, Heart, Brain, Wallet, Dumbbell, Shield, Dog, Sparkles, Bot } from "lucide-react";

export interface Service {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export interface MiniApp {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export interface FeedItem {
  id: string;
  type: "content" | "service-promo" | "miniapp-promo";
  title: string;
  description: string;
  image: string;
  video?: string; // Optional video URL
  tags: string[];
  author?: string;
  authorAvatar?: string;
  likes: number;
  comments: number;
  shares: number;
  // For promo types
  serviceId?: string;
  miniAppId?: string;
  ctaText?: string;
}

export interface ContentItem {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  duration?: string;
  author: string;
  views: string;
}

export interface Expert {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  avatar: string;
  price: string;
  available: boolean;
}

export interface UserProfile {
  name: string;
  avatar: string;
  subscription: string;
  subscriptionActive: boolean;
}

export const services: Service[] = [
  { id: "lawyer", name: "Юрист", icon: "Scale", color: "legal", description: "Консультации по любым юридическим вопросам" },
  { id: "doctor", name: "Врач", icon: "Heart", color: "health", description: "Медицинские консультации онлайн" },
  { id: "psychologist", name: "Психолог", icon: "Brain", color: "psychology", description: "Поддержка ментального здоровья" },
  { id: "finance", name: "Финансы", icon: "Wallet", color: "finance", description: "Планирование бюджета и инвестиций" },
  { id: "wellness", name: "ЗОЖ", icon: "Dumbbell", color: "wellness", description: "Здоровый образ жизни и питание" },
  { id: "security", name: "Антимошенник", icon: "Shield", color: "security", description: "Защита от мошенников" },
  { id: "vet", name: "Ветеринар", icon: "Dog", color: "vet", description: "Консультации для питомцев" },
  { id: "stylist", name: "AI-стилист", icon: "Sparkles", color: "style", description: "Подбор стиля с помощью AI" },
  { id: "assistant", name: "Ассистент", icon: "Bot", color: "assistant", description: "Универсальный AI-помощник" },
];

export const miniApps: MiniApp[] = [
  { id: "calorie-counter", name: "Счётчик калорий", icon: "🍎", color: "wellness", description: "Отслеживание питания" },
  { id: "document-check", name: "Проверка документов", icon: "📄", color: "legal", description: "Анализ договоров" },
  { id: "budget-planner", name: "Планировщик бюджета", icon: "💰", color: "finance", description: "Финансовое планирование" },
  { id: "symptom-checker", name: "Проверка симптомов", icon: "🩺", color: "health", description: "Анализ симптомов" },
];

// TikTok-style feed items with full-screen vertical images
export const feedItems: FeedItem[] = [
  {
    id: "1",
    type: "content",
    title: "5 простых упражнений для бодрого утра",
    description: "Начни день правильно! Эти упражнения займут всего 10 минут, но дадут заряд энергии на весь день",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=1400&fit=crop",
    video: "https://videos.pexels.com/video-files/4536530/4536530-uhd_1440_2732_25fps.mp4",
    tags: ["ЗОЖ", "Фитнес"],
    author: "Алексей Фитнес",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    likes: 12500,
    comments: 342,
    shares: 89,
  },
  {
    id: "2",
    type: "content",
    title: "Как распознать мошенников по телефону",
    description: "3 главных признака телефонного мошенничества. Поделись с близкими!",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=1400&fit=crop",
    tags: ["Безопасность", "Советы"],
    author: "Эксперт Безопасности",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    likes: 45200,
    comments: 1203,
    shares: 8921,
  },
  {
    id: "3",
    type: "content",
    title: "Правильный завтрак: что есть утром",
    description: "Топ-5 продуктов для идеального начала дня от диетолога",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=1400&fit=crop",
    tags: ["Питание", "ЗОЖ"],
    author: "Диетолог Мария",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    likes: 8700,
    comments: 156,
    shares: 234,
  },
  {
    id: "4",
    type: "content",
    title: "5 прав потребителя, о которых все забывают",
    description: "Знание этих прав поможет вернуть деньги за некачественный товар",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=1400&fit=crop",
    tags: ["Право", "Лайфхак"],
    author: "Юрист Иван",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    likes: 23100,
    comments: 892,
    shares: 3421,
  },
  {
    id: "5",
    type: "content",
    title: "Техника дыхания для снятия стресса",
    description: "Попробуй прямо сейчас: 4 вдоха, 7 задержка, 8 выдох",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=1400&fit=crop",
    video: "https://videos.pexels.com/video-files/3571264/3571264-uhd_1440_2560_30fps.mp4",
    tags: ["Психология", "Медитация"],
    author: "Психолог Елена",
    authorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop",
    likes: 31400,
    comments: 567,
    shares: 1234,
  },
  {
    id: "6",
    type: "content",
    title: "Как начать инвестировать с 1000 рублей",
    description: "Пошаговый гайд для новичков. Первые шаги в мире инвестиций",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=1400&fit=crop",
    tags: ["Финансы", "Инвестиции"],
    author: "Финансист Андрей",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    likes: 56800,
    comments: 2341,
    shares: 4521,
  },
  // 7th card - Service promo
  {
    id: "7",
    type: "service-promo",
    title: "Бесплатная консультация юриста",
    description: "Получи ответ на любой юридический вопрос от опытного специалиста",
    image: "https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=800&h=1400&fit=crop",
    tags: ["Реклама", "Юрист"],
    serviceId: "lawyer",
    ctaText: "Спросить бесплатно",
    likes: 0,
    comments: 0,
    shares: 0,
  },
  {
    id: "8",
    type: "content",
    title: "Утренняя йога за 15 минут",
    description: "Простой комплекс для гибкости и бодрости. Подходит для начинающих",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=1400&fit=crop",
    video: "https://videos.pexels.com/video-files/3209828/3209828-uhd_1440_2560_25fps.mp4",
    tags: ["Йога", "ЗОЖ"],
    author: "Инструктор Анна",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    likes: 18900,
    comments: 423,
    shares: 892,
  },
  {
    id: "9",
    type: "content",
    title: "Как ухаживать за кошкой зимой",
    description: "Советы ветеринара: питание, уход за шерстью и защита от холода",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&h=1400&fit=crop",
    video: "https://videos.pexels.com/video-files/855282/855282-hd_1920_1080_30fps.mp4",
    tags: ["Питомцы", "Советы"],
    author: "Ветеринар Ольга",
    authorAvatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop",
    likes: 9200,
    comments: 234,
    shares: 567,
  },
  {
    id: "10",
    type: "content",
    title: "Как говорить 'нет' без чувства вины",
    description: "Психологические техники для установления личных границ",
    image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&h=1400&fit=crop",
    tags: ["Психология", "Саморазвитие"],
    author: "Психолог Мария",
    authorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop",
    likes: 27300,
    comments: 891,
    shares: 2134,
  },
  {
    id: "11",
    type: "content",
    title: "Экономим на ЖКХ: 7 лайфхаков",
    description: "Простые способы снизить счета за коммунальные услуги",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=1400&fit=crop",
    tags: ["Финансы", "Лайфхак"],
    author: "Эксперт по экономии",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    likes: 34500,
    comments: 1567,
    shares: 5678,
  },
  {
    id: "12",
    type: "content",
    title: "Что делать при ДТП: пошаговая инструкция",
    description: "Сохрани, чтобы не растеряться в экстренной ситуации",
    image: "https://images.unsplash.com/photo-1449965408869-ebd3fee56fd1?w=800&h=1400&fit=crop",
    tags: ["Право", "Инструкция"],
    author: "Автоюрист Сергей",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    likes: 67800,
    comments: 2341,
    shares: 12456,
  },
  {
    id: "13",
    type: "content",
    title: "Рецепт идеального смузи для похудения",
    description: "Вкусно и полезно! Всего 3 ингредиента",
    image: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=800&h=1400&fit=crop",
    tags: ["Питание", "Рецепт"],
    author: "Нутрициолог Даша",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    likes: 15600,
    comments: 456,
    shares: 1234,
  },
  // 14th card - MiniApp promo
  {
    id: "14",
    type: "miniapp-promo",
    title: "Считай калории легко",
    description: "Сканируй продукты и отслеживай питание с нашим мини-приложением",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=1400&fit=crop",
    tags: ["Приложение", "ЗОЖ"],
    miniAppId: "calorie-counter",
    ctaText: "Открыть",
    likes: 0,
    comments: 0,
    shares: 0,
  },
  {
    id: "15",
    type: "content",
    title: "Как справиться с бессонницей",
    description: "5 научно доказанных методов для качественного сна",
    image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&h=1400&fit=crop",
    tags: ["Здоровье", "Сон"],
    author: "Сомнолог Виктор",
    authorAvatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop",
    likes: 42100,
    comments: 1234,
    shares: 3456,
  },
];

export const contentItems: ContentItem[] = [
  {
    id: "1",
    title: "5 упражнений для утренней разминки",
    category: "ЗОЖ",
    thumbnail: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop",
    duration: "10:35",
    author: "Фитнес-тренер Алексей",
    views: "12.5K",
  },
  {
    id: "2",
    title: "Как защитить себя от телефонных мошенников",
    category: "Безопасность",
    thumbnail: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop",
    duration: "8:20",
    author: "Эксперт по безопасности",
    views: "45.2K",
  },
  {
    id: "3",
    title: "Правильное питание: основы",
    category: "ЗОЖ",
    thumbnail: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop",
    duration: "15:00",
    author: "Диетолог Мария",
    views: "8.7K",
  },
  {
    id: "4",
    title: "Юридические права потребителя",
    category: "Право",
    thumbnail: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=300&fit=crop",
    duration: "12:45",
    author: "Юрист Иван Петров",
    views: "23.1K",
  },
  {
    id: "5",
    title: "Медитация для начинающих",
    category: "Психология",
    thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop",
    duration: "20:00",
    author: "Психолог Елена",
    views: "31.4K",
  },
  {
    id: "6",
    title: "Инвестиции для начинающих",
    category: "Финансы",
    thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop",
    duration: "18:30",
    author: "Финансовый консультант",
    views: "56.8K",
  },
];

export const experts: Record<string, Expert[]> = {
  lawyer: [
    { id: "1", name: "Иван Петров", specialty: "Гражданское право", rating: 4.9, reviews: 234, avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop", price: "2500₽/час", available: true },
    { id: "2", name: "Мария Сидорова", specialty: "Семейное право", rating: 4.8, reviews: 189, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", price: "3000₽/час", available: true },
    { id: "3", name: "Алексей Козлов", specialty: "Трудовое право", rating: 4.7, reviews: 156, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop", price: "2000₽/час", available: false },
  ],
  doctor: [
    { id: "1", name: "Елена Волкова", specialty: "Терапевт", rating: 4.9, reviews: 312, avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop", price: "1500₽/консультация", available: true },
    { id: "2", name: "Дмитрий Новиков", specialty: "Кардиолог", rating: 4.8, reviews: 245, avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop", price: "2500₽/консультация", available: true },
  ],
  psychologist: [
    { id: "1", name: "Анна Морозова", specialty: "Психотерапия", rating: 5.0, reviews: 421, avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop", price: "3500₽/сессия", available: true },
  ],
};

export const userProfile: UserProfile = {
  name: "Денис Чаннов",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
  subscription: "Премиум",
  subscriptionActive: true,
};

export const chatTemplates = [
  { id: "1", text: "Помоги составить претензию на возврат товара", category: "Юрист" },
  { id: "2", text: "Какие симптомы у простуды и как её лечить?", category: "Врач" },
  { id: "3", text: "Как справиться с тревожностью?", category: "Психолог" },
  { id: "4", text: "Как начать инвестировать с небольшой суммы?", category: "Финансы" },
  { id: "5", text: "Составь план тренировок на неделю", category: "ЗОЖ" },
  { id: "6", text: "Как проверить, что звонок не от мошенников?", category: "Безопасность" },
];

// Simplified quick actions for minimalist chat
export const quickActions = [
  { id: "1", label: "Спросить юриста", prompt: "Задай вопрос по юридической теме" },
  { id: "2", label: "Про здоровье", prompt: "Спроси о здоровье и симптомах" },
  { id: "3", label: "Проверить смету", prompt: "Помоги проверить смету на ремонт" },
  { id: "4", label: "Совет по финансам", prompt: "Дай совет по управлению финансами" },
];

export const contentCategories = ["Все", "ЗОЖ", "Право", "Финансы", "Психология", "Безопасность"];

// SuperApp grid items for settings
export const superAppItems = [
  { id: "lawyer", name: "Юрист", icon: "Scale", color: "legal" },
  { id: "doctor", name: "Врач", icon: "Heart", color: "health" },
  { id: "psychologist", name: "Психолог", icon: "Brain", color: "psychology" },
  { id: "finance", name: "Финансы", icon: "Wallet", color: "finance" },
  { id: "wellness", name: "ЗОЖ", icon: "Dumbbell", color: "wellness" },
  { id: "security", name: "Безопасность", icon: "Shield", color: "security" },
  { id: "vet", name: "Ветеринар", icon: "Dog", color: "vet" },
  { id: "stylist", name: "Стилист", icon: "Sparkles", color: "style" },
  { id: "documents", name: "Документы", icon: "FileText", color: "legal" },
  { id: "calculator", name: "Калькулятор", icon: "Calculator", color: "finance" },
  { id: "assistant", name: "Ассистент", icon: "Bot", color: "assistant" },
  { id: "settings", name: "Настройки", icon: "Settings", color: "muted" },
];
