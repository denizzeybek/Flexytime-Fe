/**
 * Time formatting utilities
 * Provides functions to parse and format time durations in human-readable format
 */

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

/**
 * Parse time string in format "DD.HH:MM" or "HH:MM" or "HH:MM:SS"
 * Examples:
 * - "109.23:27" = 109 days, 23 hours, 27 minutes
 * - "08:05" = 8 hours, 5 minutes (or 8 minutes, 5 seconds depending on context)
 * - "23:27" = 23 hours, 27 minutes
 */
export const parseDuration = (timeString: string): IParsedDuration => {
  if (!timeString) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, totalMinutes: 0 };
  }

  let days = 0;
  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  // Check if format includes days (DD.HH:MM)
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
    // Format is HH:MM or HH:MM:SS
    const timeParts = timeString.split(':');
    hours = parseInt(timeParts[0], 10) || 0;
    minutes = parseInt(timeParts[1], 10) || 0;
    seconds = parseInt(timeParts[2], 10) || 0;
  }

  const totalMinutes = days * 24 * 60 + hours * 60 + minutes;

  return { days, hours, minutes, seconds, totalMinutes };
};

/**
 * Format duration to human-readable string
 * Examples:
 * - { days: 109, hours: 23, minutes: 27 } => "109g 23s 27d" (TR) or "109d 23h 27m" (EN)
 * - { days: 0, hours: 8, minutes: 5 } => "8s 5d" (TR) or "8h 5m" (EN)
 */
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

  // If all parts are zero, show "0m" or equivalent
  if (parts.length === 0) {
    return `0${units.minutes}`;
  }

  return parts.slice(0, maxParts).join(' ');
};

/**
 * Parse and format time string in one step
 * Converts "109.23:27" to "109d 23h 27m" (EN) or "109g 23s 27d" (TR)
 */
export const formatTimeString = (
  timeString: string,
  units: ITimeUnits,
  options: { showZero?: boolean; maxParts?: number } = {},
): string => {
  const duration = parseDuration(timeString);
  return formatDuration(duration, units, options);
};

/**
 * Format a percentage value with % symbol
 * @param value - The numeric value to format
 * @param decimals - Number of decimal places (default: 1)
 */
export const formatPercentage = (value: number, decimals = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Format short time (HH:MM) to readable format
 * "08:05" => "8h 5m" or "8s 5d"
 */
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
