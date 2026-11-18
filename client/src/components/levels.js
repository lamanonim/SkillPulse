export const LEVEL_CLASS = {
  'Güclü': 'level-strong',
  'Orta': 'level-medium',
  'Zəif': 'level-weak',
};

export const DIRECTION_GROUPS = [
  { id: 'dev', title: 'Proqramlaşdırma' },
  { id: 'ops', title: 'İnfrastruktur və keyfiyyət' },
  { id: 'product', title: 'Dizayn və məhsul' },
  { id: 'business', title: 'Data və marketinq' },
];

export const DIRECTIONS = [
  {
    id: 'frontend', group: 'dev', icon: 'code', title: 'Frontend Developer', questions: 30, featured: true,
    text: 'İstifadəçinin gördüyü interfeysi quran developer.',
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Git'],
  },
  {
    id: 'backend', group: 'dev', icon: 'server', title: 'Backend Developer', questions: 30, featured: true,
    text: 'Server, API və verilənlər bazası ilə işləyən developer.',
    skills: ['Node.js', 'Express', 'SQL', 'REST API', 'Veb təhlükəsizliyi'],
  },
  {
    id: 'mobile', group: 'dev', icon: 'phone', title: 'Mobil Developer', questions: 12,
    text: 'iOS və Android üçün tətbiqlər hazırlayan developer.',
    skills: ['Mobil UX', 'React Native', 'Mobil platformalar'],
  },
  {
    id: 'devops', group: 'ops', icon: 'infinity', title: 'DevOps', questions: 12,
    text: 'Tətbiqlərin build, deploy və serverlərini idarə edən mütəxəssis.',
    skills: ['Linux', 'Docker', 'CI/CD'],
  },
  {
    id: 'qa', group: 'ops', icon: 'flask', title: 'QA (Testləşdirmə)', questions: 12,
    text: 'Məhsulun keyfiyyətini yoxlayan və xətaları tapan mütəxəssis.',
    skills: ['Manual testləşdirmə', 'Bug hesabatı', 'Avtomatlaşdırılmış test'],
  },
  {
    id: 'security', group: 'ops', icon: 'shield', title: 'Kibertəhlükəsizlik', questions: 12,
    text: 'Sistemləri və məlumatları hücumlardan qoruyan mütəxəssis.',
    skills: ['Şəbəkə təhlükəsizliyi', 'OWASP Top 10', 'Kriptoqrafiya əsasları'],
  },
  {
    id: 'uiux', group: 'product', icon: 'palette', title: 'UI/UX Dizayn', questions: 30, featured: true,
    text: 'İstifadəçi araşdırması aparan və rahat interfeyslər dizayn edən mütəxəssis.',
    skills: ['UI əsasları', 'UX araşdırma', 'Figma', 'Rəng və tipoqrafiya', 'Prototipləmə'],
  },
  {
    id: 'pm', group: 'product', icon: 'clipboard', title: 'Layihə idarəetməsi', questions: 12,
    text: 'Komandanı, vaxtı və prioritetləri idarə edən mütəxəssis.',
    skills: ['Agile və Scrum', 'Planlaşdırma', 'Komanda kommunikasiyası'],
  },
  {
    id: 'data', group: 'business', icon: 'bars', title: 'Data Analitika', questions: 12,
    text: 'Məlumatdan nəticə çıxaran və qərarlara dəstək verən analitik.',
    skills: ['Excel', 'SQL ilə analiz', 'Data vizualizasiya'],
  },
  {
    id: 'marketing', group: 'business', icon: 'megaphone', title: 'Rəqəmsal Marketinq', questions: 12,
    text: 'Brendi onlayn kanallarda böyüdən və nəticələri ölçən mütəxəssis.',
    skills: ['SMM', 'SEO', 'Marketinq analitikası'],
  },
];

export function directionTitle(id) {
  return DIRECTIONS.find((d) => d.id === id)?.title || id;
}
