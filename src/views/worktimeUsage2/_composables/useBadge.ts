import { BADGE_CONFIG } from '../_utils/constants';
import type { BadgeData } from '../_types';

export function useBadge() {
  function mapStatisticTypeToBadge(statisticType: string, value: any): BadgeData | null {
    const config = BADGE_CONFIG[statisticType as keyof typeof BADGE_CONFIG];
    
    if (!config) return null;

    return {
      ...config,
      value,
    };
  }

  return {
    mapStatisticTypeToBadge,
  };
}