// Day order mapping for different languages (Monday = 0, Sunday = 6)
export const DAY_ORDER_MAP: Record<string, number> = {
  // English
  monday: 0,
  tuesday: 1,
  wednesday: 2,
  thursday: 3,
  friday: 4,
  saturday: 5,
  sunday: 6,
  // Turkish
  pazartesi: 0,
  salı: 1,
  çarşamba: 2,
  perşembe: 3,
  cuma: 4,
  cumartesi: 5,
  pazar: 6,
  // German
  montag: 0,
  dienstag: 1,
  mittwoch: 2,
  donnerstag: 3,
  freitag: 4,
  samstag: 5,
  sonntag: 6,
  // French
  lundi: 0,
  mardi: 1,
  mercredi: 2,
  jeudi: 3,
  vendredi: 4,
  samedi: 5,
  dimanche: 6,
  // Spanish
  lunes: 0,
  martes: 1,
  miércoles: 2,
  jueves: 3,
  viernes: 4,
  sábado: 5,
  domingo: 6,
};

// Get day index from label (case-insensitive)
export const getDayIndex = (label: string): number => {
  const normalized = label.toLowerCase().trim();
  return DAY_ORDER_MAP[normalized] ?? -1;
};
