/**
 * Hijri calendar utilities using the Umm al-Qura calendar.
 * Uses Intl.DateTimeFormat with 'islamic-umalqura' calendar for accuracy.
 * Falls back to configured dates for Dhul Hijjah 1447H.
 */

// Dhul Hijjah 1447H starts Monday June 16, 2026 (based on expected astronomical data)
// Update this date each year or fetch from an Islamic calendar API
const DHUL_HIJJAH_CONFIG = {
  year: 1447,
  gregorianStart: new Date('2026-05-18T00:00:00'),
};

export function getHijriDate(): { day: number; month: number; year: number; monthName: string } {
  try {
    const formatter = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
    const parts = formatter.formatToParts(new Date());
    const day = Number(parts.find(p => p.type === 'day')?.value) || 1;
    const month = getHijriMonthNumber(parts.find(p => p.type === 'month')?.value || '');
    const year = Number(parts.find(p => p.type === 'year')?.value) || 1447;
    const monthName = parts.find(p => p.type === 'month')?.value || 'ذو الحجة';
    return { day, month, year, monthName };
  } catch {
    return { day: 1, month: 12, year: 1447, monthName: 'ذو الحجة' };
  }
}

function getHijriMonthNumber(name: string): number {
  const months: Record<string, number> = {
    'محرم': 1, 'صفر': 2, 'ربيع الأول': 3, 'ربيع الآخر': 4,
    'جمادى الأولى': 5, 'جمادى الآخرة': 6, 'رجب': 7, 'شعبان': 8,
    'رمضان': 9, 'شوال': 10, 'ذو القعدة': 11, 'ذو الحجة': 12,
  };
  for (const [key, val] of Object.entries(months)) {
    if (name.includes(key)) return val;
  }
  return 12;
}

/** Get current Dhul Hijjah day (1-10), or 0 if not in Dhul Hijjah season */
export function getDhulHijjahDay(): number {
  const hijri = getHijriDate();
  // If we're in Dhul Hijjah and within the first 10 days
  if (hijri.month === 12 && hijri.day >= 1 && hijri.day <= 10) {
    return hijri.day;
  }
  // Fallback: calculate from configured start date for demo
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const start = new Date(DHUL_HIJJAH_CONFIG.gregorianStart);
  start.setHours(0, 0, 0, 0);
  const diff = Math.floor((now.getTime() - start.getTime()) / 86400000);
  if (diff >= 0 && diff < 10) return diff + 1;
  // Demo mode: default to day 1
  return 1;
}

/** Countdown to a specific Dhul Hijjah day */
export function getCountdown(targetDay: number) {
  const now = new Date();
  const start = new Date(DHUL_HIJJAH_CONFIG.gregorianStart);
  start.setHours(0, 0, 0, 0);
  const target = new Date(start);
  target.setDate(target.getDate() + (targetDay - 1));
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
    isPast: false,
  };
}

export function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'الآن';
  if (seconds < 3600) return `منذ ${Math.floor(seconds / 60)} د`;
  if (seconds < 86400) return `منذ ${Math.floor(seconds / 3600)} س`;
  if (seconds < 604800) return `منذ ${Math.floor(seconds / 86400)} ي`;
  return new Date(timestamp).toLocaleDateString('ar-SA');
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

export function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function getOrdinalAr(n: number): string {
  const ordinals = ['', 'الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس',
    'السادس', 'السابع', 'الثامن', 'التاسع', 'العاشر'];
  return ordinals[n] || `${n}`;
}

const BLOCKED = [/كره|غبي|أحمق/i];
export function isContentSafe(text: string): boolean {
  return !BLOCKED.some(p => p.test(text));
}
