export interface TenantServiceUsageItem {
  id: string;
  name: string;
  requests: number;
  limit: number;
}

export const tenantServiceUsage: Record<string, TenantServiceUsageItem[]> = {
  dobroservice: [
    { id: 'lawyer', name: 'Юрист', requests: 1240, limit: 1500 },
    { id: 'doctor', name: 'Врач', requests: 890, limit: 1000 },
    { id: 'psychologist', name: 'Психолог', requests: 560, limit: 800 },
    { id: 'stylist', name: 'Стилист', requests: 430, limit: 500 },
    { id: 'finance', name: 'Финансист', requests: 380, limit: 500 },
    { id: 'garden', name: 'Доброградка', requests: 320, limit: 400 },
    { id: 'vet', name: 'Ветеринар', requests: 210, limit: 300 },
    { id: 'security', name: 'Безопасность', requests: 180, limit: 300 },
    { id: 'assistant', name: 'Ассистент', requests: 750, limit: 1000 },
  ],
  gazprombank: [
    { id: 'lawyer', name: 'Юрист', requests: 1840, limit: 2000 },
    { id: 'finance', name: 'Финансист', requests: 920, limit: 1000 },
    { id: 'psychologist', name: 'Психолог', requests: 450, limit: 500 },
    { id: 'doctor', name: 'Врач', requests: 380, limit: 500 },
    { id: 'security', name: 'Безопасность', requests: 210, limit: 300 },
    { id: 'assistant', name: 'Ассистент', requests: 620, limit: 1000 },
  ],
  wildberries: [
    { id: 'lawyer', name: 'Юрист', requests: 2100, limit: 2500 },
    { id: 'stylist', name: 'Стилист', requests: 1800, limit: 2000 },
    { id: 'psychologist', name: 'Психолог', requests: 650, limit: 800 },
    { id: 'assistant', name: 'Ассистент', requests: 1200, limit: 1500 },
  ],
  pochtarf: [
    { id: 'lawyer', name: 'Юрист', requests: 980, limit: 1200 },
    { id: 'security', name: 'Безопасность', requests: 540, limit: 700 },
    { id: 'doctor', name: 'Врач', requests: 310, limit: 400 },
    { id: 'assistant', name: 'Ассистент', requests: 680, limit: 800 },
  ],
  mes: [
    { id: 'lawyer', name: 'Юрист', requests: 520, limit: 600 },
    { id: 'finance', name: 'Финансист', requests: 340, limit: 400 },
    { id: 'assistant', name: 'Ассистент', requests: 410, limit: 500 },
  ],
  alfa: [
    { id: 'lawyer', name: 'Юрист', requests: 1560, limit: 1800 },
    { id: 'finance', name: 'Финансист', requests: 1120, limit: 1200 },
    { id: 'psychologist', name: 'Психолог', requests: 480, limit: 600 },
    { id: 'doctor', name: 'Врач', requests: 390, limit: 500 },
    { id: 'security', name: 'Безопасность', requests: 270, limit: 400 },
    { id: 'assistant', name: 'Ассистент', requests: 820, limit: 1000 },
  ],
};
