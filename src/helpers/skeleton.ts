/**
 * Creates skeleton placeholder data for DataTable loading states.
 * Each item gets a unique ID prefixed with 'skeleton-'.
 *
 * @param count - Number of skeleton rows to generate
 * @param template - Object template for each skeleton row (without ID)
 * @returns Array of skeleton data objects with unique IDs
 *
 * @example
 * const skeletonData = createSkeletonData(5, {
 *   Name: '',
 *   Email: '',
 *   Status: false,
 * });
 * // Returns: [{ ID: 'skeleton-0', Name: '', Email: '', Status: false }, ...]
 */
export const createSkeletonData = <T extends Record<string, unknown>>(
  count: number,
  template: Omit<T, 'ID'>,
): (T & { ID: string })[] => {
  return Array.from({ length: count }, (_, i) => ({
    ID: `skeleton-${i}`,
    ...template,
  })) as (T & { ID: string })[];
};
