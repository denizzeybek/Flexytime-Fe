const DOMAIN = {
  WORK: 4,
  COMMUNICATION: 3,
  ENTERTAINMENT: 2,
  OTHER: 1,
} as const;

export const useSuggestionDomainHelpers = () => {
  const formatSpendTime = (spend?: number): string => {
    const total = Math.max(0, Math.floor(spend ?? 0));
    if (total === 0) return '0s';
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;
    const parts: string[] = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}min`);
    if (seconds > 0) parts.push(`${seconds}s`);
    return parts.join(' ');
  };

  const getDomainColor = (domain?: number): string => {
    switch (domain) {
      case DOMAIN.WORK:
        return 'bg-emerald-500';
      case DOMAIN.COMMUNICATION:
        return 'bg-blue-500';
      case DOMAIN.ENTERTAINMENT:
        return 'bg-amber-500';
      default:
        return 'bg-gray-400 dark:bg-gray-600';
    }
  };

  const getDomainBgColor = (domain?: number): string => {
    switch (domain) {
      case DOMAIN.WORK:
        return 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400';
      case DOMAIN.COMMUNICATION:
        return 'bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400';
      case DOMAIN.ENTERTAINMENT:
        return 'bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400';
    }
  };

  const getDomainTextColor = (domain?: number): string => {
    switch (domain) {
      case DOMAIN.WORK:
        return 'text-emerald-600 dark:text-emerald-400';
      case DOMAIN.COMMUNICATION:
        return 'text-blue-600 dark:text-blue-400';
      case DOMAIN.ENTERTAINMENT:
        return 'text-amber-600 dark:text-amber-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getDomainIcon = (domain?: number): string => {
    switch (domain) {
      case DOMAIN.WORK:
        return 'pi pi-briefcase';
      case DOMAIN.COMMUNICATION:
        return 'pi pi-comments';
      case DOMAIN.ENTERTAINMENT:
        return 'pi pi-play';
      default:
        return 'pi pi-desktop';
    }
  };

  return {
    DOMAIN,
    formatSpendTime,
    getDomainColor,
    getDomainBgColor,
    getDomainTextColor,
    getDomainIcon,
  };
};
