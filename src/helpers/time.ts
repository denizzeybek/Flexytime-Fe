

export interface ITimeUnits {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

export interface IParsedDuration {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMinutes: number;
}

export const isTimeFormat = (value: string): boolean => {
  if (!value || typeof value !== 'string') return false;
  return value.includes(':') || (value.includes('.') && /^\d+\.\d+:\d+/.test(value));
};

export const parseDuration = (timeString: string): IParsedDuration => {
  if (!timeString) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, totalMinutes: 0 };
  }

  let days = 0;
  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  if (!isTimeFormat(timeString)) {
    const totalMins = parseInt(timeString, 10) || 0;
    days = Math.floor(totalMins / (24 * 60));
    const remainingAfterDays = totalMins % (24 * 60);
    hours = Math.floor(remainingAfterDays / 60);
    minutes = remainingAfterDays % 60;

    return { days, hours, minutes, seconds: 0, totalMinutes: totalMins };
  }

  if (timeString.includes('.')) {
    const [dayPart, timePart] = timeString.split('.');
    days = parseInt(dayPart, 10) || 0;

    if (timePart) {
      const timeParts = timePart.split(':');
      hours = parseInt(timeParts[0], 10) || 0;
      minutes = parseInt(timeParts[1], 10) || 0;
      seconds = parseInt(timeParts[2], 10) || 0;
    }
  } else {
    const timeParts = timeString.split(':');
    hours = parseInt(timeParts[0], 10) || 0;
    minutes = parseInt(timeParts[1], 10) || 0;
    seconds = parseInt(timeParts[2], 10) || 0;
  }

  const totalMinutes = days * 24 * 60 + hours * 60 + minutes;

  return { days, hours, minutes, seconds, totalMinutes };
};

export const formatDuration = (
  duration: IParsedDuration,
  units: ITimeUnits,
  options: { showZero?: boolean; maxParts?: number } = {},
): string => {
  const { showZero = false, maxParts = 3 } = options;
  const parts: string[] = [];

  if (duration.days > 0 || showZero) {
    parts.push(`${duration.days}${units.days}`);
  }
  if (duration.hours > 0 || (showZero && parts.length > 0)) {
    parts.push(`${duration.hours}${units.hours}`);
  }
  if (duration.minutes > 0 || (showZero && parts.length > 0)) {
    parts.push(`${duration.minutes}${units.minutes}`);
  }
  if (duration.seconds > 0 && parts.length < maxParts) {
    parts.push(`${duration.seconds}${units.seconds}`);
  }

  if (parts.length === 0) {
    return `0${units.minutes}`;
  }

  return parts.slice(0, maxParts).join(' ');
};

export const formatTimeString = (
  timeString: string,
  units: ITimeUnits,
  options: { showZero?: boolean; maxParts?: number } = {},
): string => {
  const duration = parseDuration(timeString);
  return formatDuration(duration, units, options);
};

export const formatPercentage = (value: number, decimals = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

export const secondsToDurationString = (seconds: number | null | undefined): string => {
  if (seconds == null || !Number.isFinite(seconds) || seconds <= 0) return '0';
  const total = Math.round(seconds);
  const days = Math.floor(total / 86400);
  const h = Math.floor((total % 86400) / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const tail = `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return days > 0 ? `${days}.${tail}` : tail;
};

export const formatShortTime = (timeString: string, units: ITimeUnits): string => {
  if (!timeString) return `0${units.minutes}`;

  const parts = timeString.split(':');
  const hours = parseInt(parts[0], 10) || 0;
  const minutes = parseInt(parts[1], 10) || 0;

  const result: string[] = [];
  if (hours > 0) {
    result.push(`${hours}${units.hours}`);
  }
  if (minutes > 0 || result.length === 0) {
    result.push(`${minutes}${units.minutes}`);
  }

  return result.join(' ');
};
