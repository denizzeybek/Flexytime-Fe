import { Regex } from '@/constants/regex';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

/**
 * Returns a function that will only be executed after a certain amount of time has passed since the last time it was called.
 * @param func The function to debounce.
 * @param delay The amount of time to wait before executing the function.
 * @returns A debounced version of the function.
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  return function debounced(...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = undefined;
    }, delay);
  };
}

export const nullToString = (value: any) => (value === null ? '' : value);

export const decodeJWT = (token: string) => {
  // Split the token into its parts
  const parts = token.split('.');

  if (parts.length !== 3) {
    throw new Error('Invalid JWT token');
  }

  // Base64 decode the payload (second part of the token)
  const payload = parts[1];
  const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));

  // Decode the UTF-8 string
  const utf8Decoder = new TextDecoder('utf-8');
  const decodedArray = new Uint8Array(decodedPayload.split('').map((char) => char.charCodeAt(0)));
  const parsedPayload = JSON.parse(utf8Decoder.decode(decodedArray));

  return parsedPayload;
};

export const isEmail = (email: string) => Regex.email.test(email);

export const isValidRegex = (pattern: string) => {
  try {
    new RegExp(pattern);
    return true;
  } catch (e) {
    return false;
  }
};

export const copyToClipboard = (text: string) => {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);
};

export const transformTimeValue = (event: InputEvent): string | null => {
  const input = (event.target as HTMLInputElement).value.trim();

  if (/^\d{4}$/.test(input)) {
    const hours = input.slice(0, 2);
    const minutes = input.slice(2, 4);
    const time = dayjs().hour(parseInt(hours, 10)).minute(parseInt(minutes, 10)).second(0);
    if (time.isValid() && time.hour() < 24 && time.minute() < 60) {
      return time.format('HH:mm');
    }
  }
  return null;
};

export const calculateTimeDifference = (start: string, end: string): string => {
  if (!start || !end) return 'Zaman değerleri eksik';

  const today = dayjs().format('YYYY-MM-DD'); // Bugünün tarihi

  // Start ve End zamanlarını geçerli bir tarih ile oluşturuyoruz
  const startMoment = dayjs(`${today} ${start}`, 'YYYY-MM-DD HH:mm');
  const endMoment = dayjs(`${today} ${end}`, 'YYYY-MM-DD HH:mm');

  if (!startMoment.isValid() || !endMoment.isValid()) {
    return 'Geçersiz zaman formatı';
  }
  const diff = endMoment.diff(startMoment);
  const diffDuration = dayjs.duration(diff);
  return diffDuration.format('HH:mm:ss');
};
