export interface TenantConfig {
  id: string;
  slug: string;
  name: string;
  appTitle: string;
  appSubtitle: string;
  accentColor: string; // HSL value for --primary
  enabledServices: string[];
}

export const tenants: Record<string, TenantConfig> = {
  default: {
    id: 'dobroservice',
    slug: 'default',
    name: 'Добросервис',
    appTitle: 'ДОБРОСЕРВИС',
    appSubtitle: 'Ваш AI-помощник на каждый день',
    accentColor: '142 76% 36%',
    enabledServices: ['lawyer','doctor','psychologist','stylist','finance','garden','vet','security','wellness','realtor','beauty','assistant'],
  },
  gpb: {
    id: 'gazprombank',
    slug: 'gpb',
    name: 'Газпромбанк',
    appTitle: 'ГПБ КОНСЬЕРЖ',
    appSubtitle: 'Персональный помощник клиента',
    accentColor: '210 100% 35%',
    enabledServices: ['lawyer','finance','psychologist','doctor','security','assistant'],
  },
  wb: {
    id: 'wildberries',
    slug: 'wb',
    name: 'Wildberries',
    appTitle: 'WB ПОМОЩНИК',
    appSubtitle: 'Помощь покупателям и продавцам',
    accentColor: '280 80% 50%',
    enabledServices: ['lawyer','stylist','psychologist','assistant'],
  },
  pochtarf: {
    id: 'pochtarf',
    slug: 'pochtarf',
    name: 'Почта России',
    appTitle: 'ПОЧТА ПОМОЩЬ',
    appSubtitle: 'Сервис поддержки клиентов',
    accentColor: '215 70% 45%',
    enabledServices: ['lawyer','security','doctor','assistant'],
  },
  mes: {
    id: 'mes',
    slug: 'mes',
    name: 'Мосэнергосервис',
    appTitle: 'МЭС СЕРВИС',
    appSubtitle: 'Ваш помощник по ЖКХ',
    accentColor: '25 90% 50%',
    enabledServices: ['lawyer','finance','assistant'],
  },
  alfa: {
    id: 'alfa',
    slug: 'alfa',
    name: 'Альфа-Банк',
    appTitle: 'АЛЬФА ПОМОЩНИК',
    appSubtitle: 'Персональный консьерж-сервис',
    accentColor: '0 85% 50%',
    enabledServices: ['lawyer','finance','psychologist','doctor','security','assistant'],
  },
};
