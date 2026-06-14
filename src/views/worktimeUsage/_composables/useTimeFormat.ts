

import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { formatShortTime, formatTimeString, isTimeFormat, type ITimeUnits } from '@/helpers/time';
import { type MessageSchema } from '@/plugins/i18n';

export const useTimeFormat = () => {
  const { t } = useI18n<{ message: MessageSchema }>();

  const timeUnits = computed<ITimeUnits>(() => ({
    days: t('common.time.days'),
    hours: t('common.time.hours'),
    minutes: t('common.time.minutes'),
    seconds: t('common.time.seconds'),
  }));

  const formatDuration = (time: string | undefined): string => {
    if (!time || time === '-') return '-';

    if (!isTimeFormat(time) && !/^\d+$/.test(time)) {
      return time;
    }

    return formatTimeString(time, timeUnits.value);
  };

  const formatTime = (time: string | undefined): string => {
    if (!time || time === '-') return '-';
    return formatShortTime(time, timeUnits.value);
  };

  return {
    timeUnits,
    formatDuration,
    formatTime,
  };
};
