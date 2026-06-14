
export const createSkeletonData = <T extends Record<string, unknown>>(
  count: number,
  template: Omit<T, 'ID'>,
): (T & { ID: string })[] => {
  return Array.from({ length: count }, (_, i) => ({
    ID: `skeleton-${i}`,
    ...template,
  })) as (T & { ID: string })[];
};
