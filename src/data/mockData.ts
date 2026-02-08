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

export const quickActions = [
  { id: "1", icon: "⚖️", label: "Вопрос юристу", prompt: "Задай вопрос по юридической теме" },
  { id: "2", icon: "🏥", label: "Про здоровье", prompt: "Спроси о здоровье и симптомах" },
  { id: "3", icon: "📝", label: "Проверить смету", prompt: "Помоги проверить смету на ремонт" },
  { id: "4", icon: "💳", label: "Совет по финансам", prompt: "Дай совет по управлению финансами" },
  { id: "5", icon: "🧘", label: "Снять стресс", prompt: "Помоги расслабиться и снять стресс" },
  { id: "6", icon: "🛡️", label: "Проверить на мошенничество", prompt: "Проверь, не мошенничество ли это" },
];

export const contentCategories = ["Все", "ЗОЖ", "Право", "Финансы", "Психология", "Безопасность"];
