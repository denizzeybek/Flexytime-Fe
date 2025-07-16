export interface BadgeData {
  severity: string;
  title: string;
  icon: string;
  value: any;
}

export function useStaticBadge() {
  function mapStatisticTypeToBadge(statisticType: string, value: any): BadgeData | null {
    const mapping: Record<string, Omit<BadgeData, 'value'>> = {
      work: {
        severity: 'success',
        title: 'Work',
        icon: 'pi pi-wrench',
      },
      meeting: {
        severity: 'warn',
        title: 'Meeting',
        icon: 'pi pi-crown',
      },
      leisure: {
        severity: 'danger',
        title: 'Leisure',
        icon: 'pi pi-calendar-clock',
      },
      unclassified: {
        severity: 'secondary',
        title: 'Unclassified',
        icon: 'pi pi-question',
      },
      starttime: {
        severity: 'info',
        title: 'Start Time',
        icon: 'pi pi-clock',
      },
      endtime: {
        severity: 'primary',
        title: 'End Time',
        icon: 'pi pi-clock',
      },
    };

    const base = mapping[statisticType];
    if (!base) return null;

    return { ...base, value };
  }

  return { mapStatisticTypeToBadge };
}
