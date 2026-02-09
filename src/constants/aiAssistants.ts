import { 
  Scale, Heart, Brain, Wallet, Dumbbell, Shield, 
  Sprout, Sparkles, Bot, PawPrint, LucideIcon
} from "lucide-react";

export interface Suggestion {
  icon: string;
  label: string;
  prompt: string;
}

export interface AIAssistant {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string; // HSL values
  suggestions: Suggestion[];
}

// Service-specific suggestions
const lawyerSuggestions: Suggestion[] = [
  { icon: "⚖️", label: "Развод", prompt: "Как оформить развод?" },
  { icon: "👶", label: "Алименты", prompt: "Как рассчитать алименты на ребёнка?" },
  { icon: "🏠", label: "Наследство", prompt: "Как оформить наследство?" },
  { icon: "📄", label: "Договор", prompt: "Проверь мой договор на риски" },
  { icon: "💼", label: "Увольнение", prompt: "Меня незаконно увольняют, что делать?" },
  { icon: "🚗", label: "ДТП", prompt: "Попал в ДТП, как получить компенсацию?" },
];

const doctorSuggestions: Suggestion[] = [
  { icon: "🤕", label: "Головная боль", prompt: "Болит голова третий день, что делать?" },
  { icon: "📋", label: "Анализы", prompt: "Расшифруй мои анализы крови" },
  { icon: "💊", label: "Лекарства", prompt: "Побочные эффекты препарата" },
  { icon: "🤒", label: "Температура", prompt: "Высокая температура, когда вызывать врача?" },
  { icon: "😴", label: "Бессонница", prompt: "Не могу уснуть уже неделю" },
  { icon: "🩺", label: "Симптомы", prompt: "Какие симптомы у простуды?" },
];

const psychologistSuggestions: Suggestion[] = [
  { icon: "😰", label: "Тревога", prompt: "Постоянная тревожность на работе" },
  { icon: "😔", label: "Стресс", prompt: "Как справиться со стрессом?" },
  { icon: "😴", label: "Сон", prompt: "Не могу уснуть из-за мыслей" },
  { icon: "💔", label: "Отношения", prompt: "Проблемы в отношениях с партнёром" },
  { icon: "😤", label: "Гнев", prompt: "Как контролировать гнев?" },
  { icon: "🧘", label: "Медитация", prompt: "Техники расслабления для начинающих" },
];

const fitnessSuggestions: Suggestion[] = [
  { icon: "🏋️", label: "Новичку", prompt: "Программа тренировок для новичка" },
  { icon: "🦵", label: "Спина", prompt: "Болит спина после тренировки" },
  { icon: "🥗", label: "Питание", prompt: "Что есть до и после тренировки?" },
  { icon: "⚡", label: "Похудение", prompt: "Как быстро похудеть без вреда?" },
  { icon: "💪", label: "Мышцы", prompt: "Как набрать мышечную массу?" },
  { icon: "🏃", label: "Кардио", prompt: "Сколько бегать для здоровья?" },
];

const financeSuggestions: Suggestion[] = [
  { icon: "📊", label: "Вычет", prompt: "Как получить налоговый вычет?" },
  { icon: "💰", label: "Инвестиции", prompt: "Куда вложить 100 тысяч рублей?" },
  { icon: "🏦", label: "Кредит", prompt: "Как выгодно взять кредит?" },
  { icon: "📈", label: "Акции", prompt: "С чего начать инвестировать?" },
  { icon: "💳", label: "Долги", prompt: "Как выбраться из долгов?" },
  { icon: "🏠", label: "Ипотека", prompt: "Стоит ли брать ипотеку сейчас?" },
];

const gardenSuggestions: Suggestion[] = [
  { icon: "🌱", label: "Рассада", prompt: "Когда сажать рассаду помидоров?" },
  { icon: "🍅", label: "Томаты", prompt: "Чем подкормить томаты?" },
  { icon: "🐛", label: "Вредители", prompt: "Как избавиться от тли?" },
  { icon: "💧", label: "Полив", prompt: "Как часто поливать огурцы?" },
  { icon: "🌻", label: "Цветы", prompt: "Какие цветы посадить в тени?" },
  { icon: "🥒", label: "Урожай", prompt: "Как увеличить урожай?" },
];

const styleSuggestions: Suggestion[] = [
  { icon: "👗", label: "Мой стиль", prompt: "Подбери мне образ" },
  { icon: "🎨", label: "Цветотип", prompt: "Определи мой цветотип" },
  { icon: "👠", label: "Обувь", prompt: "Какую обувь подобрать к платью?" },
  { icon: "💍", label: "Аксессуары", prompt: "Как подобрать украшения?" },
  { icon: "🧥", label: "Капсула", prompt: "Собери мне капсульный гардероб" },
  { icon: "✨", label: "Тренды", prompt: "Что модно в этом сезоне?" },
];

const vetSuggestions: Suggestion[] = [
  { icon: "🐱", label: "Кот не ест", prompt: "Кот не ест второй день, что делать?" },
  { icon: "💉", label: "Прививки", prompt: "Какие прививки нужны щенку?" },
  { icon: "🦮", label: "Поведение", prompt: "Собака грызёт мебель" },
  { icon: "🍖", label: "Питание", prompt: "Чем кормить котёнка?" },
  { icon: "🏥", label: "Симптомы", prompt: "Собака хромает, что проверить?" },
  { icon: "🧴", label: "Уход", prompt: "Как ухаживать за шерстью?" },
];

const securitySuggestions: Suggestion[] = [
  { icon: "🔒", label: "Мошенники", prompt: "Как распознать мошенников?" },
  { icon: "📱", label: "Взлом", prompt: "Взломали аккаунт, что делать?" },
  { icon: "💳", label: "Карты", prompt: "Как защитить банковскую карту?" },
  { icon: "🔐", label: "Пароли", prompt: "Как создать надёжный пароль?" },
  { icon: "📧", label: "Фишинг", prompt: "Как распознать фишинговое письмо?" },
  { icon: "🛡️", label: "Данные", prompt: "Как защитить личные данные?" },
];

// Default universal suggestions (same as current SuggestionTicker)
const defaultSuggestions: Suggestion[] = [
  { icon: "🌱", label: "Что сажать?", prompt: "Что сейчас сажать в моём регионе?" },
  { icon: "⚖️", label: "Возврат товара", prompt: "Помоги с возвратом товара" },
  { icon: "🩺", label: "Симптомы", prompt: "Какие симптомы у простуды?" },
  { icon: "💰", label: "Бюджет", prompt: "Как начать копить деньги?" },
  { icon: "👗", label: "Мой стиль", prompt: "Подбери мне образ" },
  { icon: "🍳", label: "Рецепты", prompt: "Что приготовить на ужин?" },
  { icon: "🧠", label: "Стресс", prompt: "Как справиться со стрессом?" },
  { icon: "🐕", label: "Питомец", prompt: "Чем кормить щенка?" },
  { icon: "🏋️", label: "Фитнес", prompt: "Упражнения для дома" },
  { icon: "📄", label: "Документы", prompt: "Проверь мой договор" },
  { icon: "💊", label: "Лекарства", prompt: "Аналоги лекарств" },
  { icon: "🎁", label: "Подарок", prompt: "Что подарить маме?" },
  { icon: "🔒", label: "Мошенники", prompt: "Как распознать мошенников?" },
  { icon: "💼", label: "Работа", prompt: "Права работника" },
  { icon: "🏠", label: "ЖКХ", prompt: "Как снизить счета ЖКХ?" },
  { icon: "✈️", label: "Отпуск", prompt: "Куда поехать зимой?" },
  { icon: "🎓", label: "Обучение", prompt: "Как выучить новое?" },
  { icon: "🚗", label: "Авто", prompt: "Как выбрать машину?" },
];

export const AI_ASSISTANTS: Record<string, AIAssistant> = {
  lawyer: {
    id: "lawyer",
    name: "Юрист Алексей",
    icon: Scale,
    color: "199 89% 48%",
    suggestions: lawyerSuggestions,
  },
  doctor: {
    id: "doctor",
    name: "Доктор Мария",
    icon: Heart,
    color: "350 89% 60%",
    suggestions: doctorSuggestions,
  },
  psychologist: {
    id: "psychologist",
    name: "Психолог Анна",
    icon: Brain,
    color: "280 65% 60%",
    suggestions: psychologistSuggestions,
  },
  fitness: {
    id: "fitness",
    name: "Тренер Дима",
    icon: Dumbbell,
    color: "38 92% 50%",
    suggestions: fitnessSuggestions,
  },
  wellness: {
    id: "wellness",
    name: "Тренер Дима",
    icon: Dumbbell,
    color: "38 92% 50%",
    suggestions: fitnessSuggestions,
  },
  finance: {
    id: "finance",
    name: "Финансист Олег",
    icon: Wallet,
    color: "142 76% 36%",
    suggestions: financeSuggestions,
  },
  garden: {
    id: "garden",
    name: "Садовод Нина",
    icon: Sprout,
    color: "84 70% 45%",
    suggestions: gardenSuggestions,
  },
  stylist: {
    id: "stylist",
    name: "Стилист Лиза",
    icon: Sparkles,
    color: "328 86% 70%",
    suggestions: styleSuggestions,
  },
  style: {
    id: "style",
    name: "Стилист Лиза",
    icon: Sparkles,
    color: "328 86% 70%",
    suggestions: styleSuggestions,
  },
  vet: {
    id: "vet",
    name: "Ветеринар Макс",
    icon: PawPrint,
    color: "174 60% 41%",
    suggestions: vetSuggestions,
  },
  security: {
    id: "security",
    name: "Эксперт по безопасности",
    icon: Shield,
    color: "262 83% 58%",
    suggestions: securitySuggestions,
  },
  default: {
    id: "default",
    name: "Добро-ассистент",
    icon: Bot,
    color: "142 76% 36%", // primary
    suggestions: defaultSuggestions,
  },
};

export function getAssistant(serviceId?: string | null): AIAssistant {
  if (!serviceId) return AI_ASSISTANTS.default;
  return AI_ASSISTANTS[serviceId] || AI_ASSISTANTS.default;
}

export function getDefaultSuggestions(): Suggestion[] {
  return defaultSuggestions;
}
